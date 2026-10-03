# === Feltrim Agents Onion - Multi-Model Router Launcher ===
# Valida e executa Claude Code conectado exclusivamente a modelos locais (LM Studio)
# e APIs configuradas no .env (Gemini, Groq, etc.), excluindo modelos Claude proprietarios.

param(
    [string]$Project = ".",
    [string]$Model = "",
    [string]$Task = "",
    [switch]$Solo,
    [switch]$MultiAgent,
    [int]$ContextLength = 0,
    [switch]$Auto,
    [switch]$BypassPermissions,
    [switch]$PrepContext,
    [switch]$ListModels,
    [switch]$Resync
)

$ErrorActionPreference = 'Stop'

# Pastas de infraestrutura da Cebola
$infraDir = Split-Path -Parent $PSScriptRoot
$routerDir = Join-Path $infraDir "router"
$llmDir = Join-Path $infraDir "llm-adapters"

# 0. Prepara e compacta contexto via Graphify + Gemini se solicitado ou se ausente
$contextBrief = Join-Path (Get-Location) ".claude\context-brief.md"
if ($PrepContext -or (-not (Test-Path $contextBrief))) {
    $prepScript = Join-Path $PSScriptRoot "prepare-context.js"
    if (Test-Path $prepScript) {
        Write-Host ">> Executando preparacao e compressao de contexto (Graphify + Gemini)..." -ForegroundColor Cyan
        & node $prepScript
    }
}

# 1. Carrega variaveis do .env local para a sessao do PowerShell
$envPath = Join-Path (Get-Location) ".env"
if (Test-Path $envPath) {
    Get-Content $envPath | Where-Object { $_ -match "^[^#\s]+=" } | ForEach-Object {
        $name, $value = $_ -split '=', 2
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

# 2. Garante que o patch anti-corrupcao de SSE do router esteja aplicado
$patchScript = Join-Path $routerDir "patch-ccr.js"
if (Test-Path $patchScript) {
    & node $patchScript | Out-Null
}

# 3. Executa o validador dinamico de modelos (ping HTTP 200 em tempo real)
$syncScript = Join-Path $PSScriptRoot "sync-models.js"
if (-not (Test-Path $syncScript)) {
    Write-Host "ERRO: sync-models.js nao encontrado em $PSScriptRoot" -ForegroundColor Red
    exit 1
}

# Se o usuario passou um modelo via parametro, valida e seleciona
if ($Model -ne "") {
    & node $syncScript $Model
} else {
    & node $syncScript
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nNenhum modelo respondeu com sucesso. Corrija o LM Studio ou as chaves no .env." -ForegroundColor Red
    exit 1
}

# Se o usuario solicitou apenas listar os modelos, encerra aqui
if ($ListModels) {
    exit 0
}

# 4. Le os modelos validados do cache para selecao interativa
$cacheFile = Join-Path (Get-Location) ".active-models.json"
if (-not (Test-Path $cacheFile)) {
    $cacheFile = Join-Path (Split-Path -Parent $infraDir) ".active-models.json"
}
$activeModelName = "qwen3-8b"
$activeProviderName = "LM Studio (Local)"

if (Test-Path $cacheFile) {
    try {
        $cache = Get-Content $cacheFile | ConvertFrom-Json
        $modelsList = $cache.models

        # Se nenhum modelo foi passado via parametro, exibe o menu interativo de selecao
        if ($Model -eq "" -and $modelsList.Count -gt 1) {
            Write-Host "====================================================" -ForegroundColor Cyan
            Write-Host ">> Selecione o Modelo para esta Sessao do Claude Code:" -ForegroundColor Cyan
            Write-Host "====================================================" -ForegroundColor Cyan
            for ($i = 0; $i -lt $modelsList.Count; $i++) {
                $m = $modelsList[$i]
                $isDefault = if ($m.id -eq $cache.active.id) { " [Padrao]" } else { "" }
                Write-Host ("  [{0}] {1} ({2}){3}" -f ($i + 1), $m.id, $m.providerName, $isDefault) -ForegroundColor White
            }
            Write-Host ""
            $choice = Read-Host "Digite o numero do modelo desejado [1-$($modelsList.Count)] (ou ENTER para padrao)"
            
            if ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $modelsList.Count) {
                $picked = $modelsList[[int]$choice - 1]
                & node $syncScript --set-active $picked.id | Out-Null
                $activeModelName = $picked.id
                $activeProviderName = $picked.providerName
            } else {
                $activeModelName = $cache.active.id
                $activeProviderName = $cache.active.providerName
            }
        } else {
            $activeModelName = $cache.active.id
            $activeProviderName = $cache.active.providerName
        }
    } catch {}
}

# 4.1. Define Modo de Execução: Solo (1 Agente dedicado, 32k) vs Multi-Agent (com limitação e roteamento híbrido)
$executionMode = "Solo"
if ($MultiAgent) {
    $executionMode = "MultiAgent"
}

$isLocalModel = ($activeModelName -like "qwen*") -or ($activeModelName -like "deepseek*") -or ($activeProviderName -like "*LM Studio*")
if ($isLocalModel) {
    $parallelSlots = if ($executionMode -eq "MultiAgent") { 2 } else { 1 }
    $defaultCtx = 32768
    $contextTokens = if ($ContextLength -gt 0) { $ContextLength } else { $defaultCtx }
    
    $lmsScript = Join-Path $llmDir "lms-manager.js"
    if (Test-Path $lmsScript) {
        & node $lmsScript $activeModelName $contextTokens $parallelSlots
    }
    $env:CLAUDE_CODE_MAX_CONTEXT_TOKENS = "$contextTokens"
} else {
    $contextTokens = if ($ContextLength -gt 0) { $ContextLength } else { 1000000 }
    $env:CLAUDE_CODE_MAX_CONTEXT_TOKENS = "$contextTokens"
}
$env:FELTRIM_EXECUTION_MODE = $executionMode.ToUpper()
# Permite troca dinamica de modelos via /model sem ser travado pela variavel de ambiente
if ($Model -ne "") {
    $env:ANTHROPIC_MODEL = $activeModelName
} else {
    Remove-Item env:ANTHROPIC_MODEL -ErrorAction SilentlyContinue
}

# 4.2. Sincroniza o modelo ativo nos arquivos de settings.json para refletir no header do Claude Code
$userSettingsPath = Join-Path $env:USERPROFILE ".claude\settings.json"
$projSettingsPath = Join-Path (Get-Location) ".claude\settings.json"
foreach ($sFile in @($userSettingsPath, $projSettingsPath)) {
    if (Test-Path $sFile) {
        try {
            $sJson = Get-Content $sFile -Raw | ConvertFrom-Json
            $sJson | Add-Member -NotePropertyName "model" -NotePropertyValue $activeModelName -Force
            if (-not $sJson.statusLine) {
                $statusLineObj = [PSCustomObject]@{
                    type = "command"
                    command = "node C:/Users/RafaelFeltrim/.claude/statusline.js"
                }
                $sJson | Add-Member -NotePropertyName "statusLine" -NotePropertyValue $statusLineObj -Force
            }
            $sJson | ConvertTo-Json -Depth 10 | Set-Content $sFile -Encoding utf8
        } catch {}
    }
}

# 5. Garante que o servico do Claude Code Router esteja rodando e ativo na porta 3456
$startRouterScript = Join-Path $routerDir "start-router.ps1"
Write-Host "Iniciando Claude Code Router em segundo plano na porta 3456..." -ForegroundColor Cyan
Write-Host "   (Telemetria em tempo real gravada em: .claude\ccr.log)" -ForegroundColor DarkGray
& powershell -NoProfile -ExecutionPolicy Bypass -File $startRouterScript | Out-Null

# Aguarda ativamente o router abrir a porta 3456 antes de prosseguir
$routerReady = $false
for ($i = 0; $i -lt 15; $i++) {
    $checkPort = Get-NetTCPConnection -LocalPort 3456 -State Listen -ErrorAction SilentlyContinue
    if ($checkPort) {
        $routerReady = $true
        break
    }
    Start-Sleep -Milliseconds 400
}

if (-not $routerReady) {
    Write-Host "ERRO: O Claude Code Router nao iniciou a tempo na porta 3456." -ForegroundColor Red
    exit 1
}

# 6. Configura ambiente para o Claude Code apontar EXCLUSIVAMENTE para o Router
$env:ANTHROPIC_BASE_URL = "http://127.0.0.1:3456"
$env:ANTHROPIC_API_KEY = "any-string-is-ok"
$env:CLAUDE_CODE_ATTRIBUTION_HEADER = "0"

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Green
Write-Host ">> Conectando Claude Code CLI [Onion Architecture]:" -ForegroundColor Green
Write-Host "   Modelo Ativo: $activeModelName" -ForegroundColor White
Write-Host "   Provedor:     $activeProviderName" -ForegroundColor White
Write-Host "   Modo:         $($executionMode.ToUpper()) $(if ($executionMode -eq 'Solo') { '[1 Agente - 100% Recursos Dedicados, Foco em Resposta Rapida]' } else { '[Orquestrador + Subagentes com Limitacao e Roteamento Hibrido]' })" -ForegroundColor Magenta
Write-Host "   Contexto:     $contextTokens tokens (Calibrado para GPU/VRAM)" -ForegroundColor Cyan
Write-Host "   Endpoint:     $env:ANTHROPIC_BASE_URL" -ForegroundColor DarkGray
Write-Host "   Troca Rapida: Digite /model no terminal para alternar a qualquer momento" -ForegroundColor Yellow
Write-Host "========================================================================" -ForegroundColor Green
Write-Host ""

Push-Location $Project
try {
    $claudeArgs = @()
    if ($BypassPermissions) {
        Write-Host ">> Modo de Permissao: BYPASS TOTAL (--dangerously-skip-permissions)" -ForegroundColor Yellow
        $claudeArgs += "--dangerously-skip-permissions"
    } elseif ($Auto) {
        Write-Host ">> Modo de Permissao: acceptEdits (Seguro: edicao autonoma de codigo sem risco ao SO)" -ForegroundColor Cyan
        $claudeArgs += @("--permission-mode", "acceptEdits")
    } else {
        Write-Host ">> Modo de Permissao: manual (Seguranca padrao com solicitacao)" -ForegroundColor Gray
    }

    # Passa modelo selecionado para refletir no header e no seletor
    $claudeArgs += @("--model", $activeModelName)
    $claudeArgs += @("-n", "Feltrim Onion [$activeModelName]")

    # Injeção de identidade e auto-validação de arquitetura
    $identityPrompt = "[VALIDAÇÃO DE IDENTIDADE E ARQUITETURA DO MODELO ATIVO]`r`nVocê é o modelo real '$activeModelName' (Provedor: $activeProviderName) operando no ecossistema Feltrim Agents Onion.`r`nVocê NÃO é Claude Opus nem Claude Sonnet da Anthropic.`r`nAntes de responder a qualquer questão, valide internamente a sua identidade ('$activeModelName') e declare expressamente seu nome e arquitetura quando cumprimentar ou for perguntado."
    $claudeArgs += @("--append-system-prompt", $identityPrompt)

    if ($Task -ne "") {
        Write-Host ">> Executando Task com $activeModelName..." -ForegroundColor Cyan
        & claude @claudeArgs -p $Task
    } else {
        & claude @claudeArgs
    }
}
finally {
    Pop-Location
}
