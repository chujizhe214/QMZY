@echo off
chcp 65001 >nul
echo 正在启动 PostgreSQL...
"D:\develop\pgsql\bin\pg_ctl.exe" -D "D:\develop\pgsql\data" -l "D:\develop\pgsql\data\server.log" start
if errorlevel 1 (
  echo 启动失败，可能已经在运行。可执行下面命令查看状态：
  echo "D:\develop\pgsql\bin\pg_ctl.exe" -D "D:\develop\pgsql\data" status
) else (
  echo PostgreSQL 已启动，端口 5432。
)
pause
