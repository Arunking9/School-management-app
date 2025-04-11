@echo off
cd /d %~dp0
echo Starting Cloudflare Tunnel...
cloudflared.exe tunnel --config .cloudflared/config.yml run school-management
pause 