@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp004-infrastructure\cli\start-claude-multi.ps1" %*
