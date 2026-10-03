param(
    [switch]$Force
)

$ErrorActionPreference = 'SilentlyContinue'

# 1. Mata processos existentes na porta 3456
$existing = Get-NetTCPConnection -LocalPort 3456 -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    $existing | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Milliseconds 400
}

# 2. Garante pastas
$claudeDir = Join-Path (Get-Location) ".claude"
if (-not (Test-Path $claudeDir)) {
    New-Item -ItemType Directory -Path $claudeDir -Force | Out-Null
}

$logFile = Join-Path $claudeDir "ccr.log"
$errFile = Join-Path $claudeDir "ccr.err.log"
$cliPath = Join-Path $env:APPDATA "npm\node_modules\claude-code-router\dist\cli.js"

# 3. Inicia processo nativo em segundo plano com redirecionamento de logs
$proc = Start-Process -FilePath "node.exe" -ArgumentList @($cliPath, "start") -RedirectStandardOutput $logFile -RedirectStandardError $errFile -WindowStyle Hidden -PassThru

# 4. Aguarda confirmacao de subida da porta 3456
$ready = $false
for ($i = 0; $i -lt 15; $i++) {
    Start-Sleep -Milliseconds 300
    $check = Get-NetTCPConnection -LocalPort 3456 -State Listen -ErrorAction SilentlyContinue
    if ($check) {
        $ready = $true
        break
    }
}

if ($ready) {
    Write-Host "[OK] Claude Code Router ativo na porta 3456 (PID: $($proc.Id))" -ForegroundColor Green
    Write-Host "     Logs: $logFile" -ForegroundColor DarkGray
} else {
    Write-Host "[ERRO] Claude Code Router nao iniciou na porta 3456." -ForegroundColor Red
    if (Test-Path $errFile) {
        Get-Content $errFile -Tail 10
    }
}
