const fs = require('fs');
const { execSync, spawn } = require('child_process');
const path = require('path');

// 1. Matar processos antigos na porta 3456
try {
  const pids = execSync('powershell -Command "Get-NetTCPConnection -LocalPort 3456 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"')
    .toString()
    .trim()
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);

  for (const pid of pids) {
    try {
      execSync(`taskkill /F /PID ${pid} >nul 2>&1`);
      console.log('Killed old PID on 3456:', pid);
    } catch (_) {}
  }
} catch (_) {}

// 2. Garantir pasta .claude
const claudeDir = path.resolve('.claude');
if (!fs.existsSync(claudeDir)) fs.mkdirSync(claudeDir, { recursive: true });

// 3. Abrir ccr.log e spawnar processo desanexado permanente
const logFile = path.join(claudeDir, 'ccr.log');
const cliPath = path.join(process.env.APPDATA, 'npm/node_modules/claude-code-router/dist/cli.js');

const outFd = fs.openSync(logFile, 'a');
const p = spawn(process.execPath, [cliPath, 'start'], {
  detached: true,
  stdio: ['ignore', outFd, outFd],
  windowsHide: true
});
p.unref();

console.log(`Router iniciado com sucesso (PID: ${p.pid}), logs em: ${logFile}`);
