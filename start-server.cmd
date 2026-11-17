@echo off
chcp 65001 >nul
cd /d "%~dp0server"
echo 正在启动后端，启动后请访问 http://localhost:8080
call mvn spring-boot:run
pause
