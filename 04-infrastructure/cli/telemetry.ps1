# === Feltrim Agents - Telemetria e Observabilidade ===
# Monitora a saude do Claude Code Router, LM Studio, consumo e logs em tempo real.

param(
    [switch]$Follow,
    [switch]$f,
    [int]$Lines = 25
)

$ErrorActionPreference = 'SilentlyContinue'
$doFollow = $Follow -or $f

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "   FELTRIM AGENTS - PAINEL DE TELEMETRIA E OBSERVABILIDADE" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Status do Claude Code Router (porta 3456)
try {
    $resCCR = Invoke-RestMethod -Uri "http://127.0.0.1:3456/status" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "[OK] Claude Code Router (Porta 3456): ONLINE" -ForegroundColor Green
    Write-Host "     Endpoints: /v1/messages (Proxy) | /health | /status" -ForegroundColor DarkGray
    if ($resCCR -and $resCCR.providers) {
        $pCount = ($resCCR.providers | Get-Member -MemberType NoteProperty).Count
        Write-Host "     Provedores Carregados: $pCount" -ForegroundColor Gray
    }
} catch {
    Write-Host "[ALERTA] Claude Code Router (Porta 3456): OFFLINE / INDISPONIVEL" -ForegroundColor Yellow
}

# 2. Status do LM Studio (porta 1234)
try {
    $resLMS = Invoke-RestMethod -Uri "http://127.0.0.1:1234/v1/models" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "[OK] LM Studio Server (Porta 1234): ONLINE" -ForegroundColor Green
    if ($resLMS.data) {
        $models = $resLMS.data | ForEach-Object { $_.id }
        Write-Host ("     Modelos Prontos no Servidor: " + ($models -join ", ")) -ForegroundColor White
    }
} catch {
    Write-Host "[ALERTA] LM Studio Server (Porta 1234): OFFLINE ou Local Server Desativado" -ForegroundColor Yellow
}

# 3. Modelo Ativo do Ecossistema (.active-models.json)
$activeFile = Join-Path (Get-Location) ".active-models.json"
if (Test-Path $activeFile) {
    try {
        $cache = Get-Content $activeFile -Raw | ConvertFrom-Json
        Write-Host "Modelo Ativo Configurado: $($cache.active.id) ($($cache.active.providerName))" -ForegroundColor Cyan
    } catch {}
}

Write-Host ""
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "LOCALIZACAO DE LOGS E TELEMETRIA:" -ForegroundColor DarkGray
Write-Host "  1. Logs do Router (CCR):           .claude\ccr.log" -ForegroundColor White
Write-Host "  2. Transcricoes do Claude Code:    $env:USERPROFILE\.claude\projects\" -ForegroundColor White
Write-Host "  3. Metricas no LM Studio:          Aba Developer -> Local Server (TTFT, tok/s, VRAM)" -ForegroundColor White
Write-Host "  4. Metricas de Tokens RTK:         rtk gain  /  rtk gain --history" -ForegroundColor White
Write-Host "------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

# 4. Exibição dos logs do Router
$logFile = Join-Path (Get-Location) ".claude\ccr.log"
if (-not (Test-Path $logFile)) {
    Write-Host "Arquivo .claude\ccr.log ainda nao criado. Ele sera gerado na proxima execucao de start.cmd" -ForegroundColor DarkGray
} else {
    if ($doFollow) {
        Write-Host ">> Acompanhando .claude\ccr.log em tempo real (Ctrl+C para sair):" -ForegroundColor Yellow
        Get-Content $logFile -Tail $Lines -Wait
    } else {
        Write-Host ">> Ultimas $Lines linhas de .claude\ccr.log:" -ForegroundColor Yellow
        Get-Content $logFile -Tail $Lines
        Write-Host ""
        Write-Host "DICA: Para acompanhar o log continuamente enquanto conversa, execute:" -ForegroundColor DarkGray
        Write-Host "   .\telemetry.cmd -f" -ForegroundColor Cyan
    }
}
Write-Host ""
