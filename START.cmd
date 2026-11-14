@echo off
setlocal
cd /d "%~dp0"
title G. DESIGN - local website
where node.exe >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js LTS and try again.
  pause
  exit /b 1
)
if not exist "node_modules\next\package.json" (
  echo Installing project dependencies...
  call npm.cmd ci
  if errorlevel 1 (
    echo Installation failed. See the error above.
    pause
    exit /b 1
  )
)
echo.
echo G. DESIGN - http://localhost:3000
echo Keep this window open. Press Ctrl+C to stop the website.
echo.
call npm.cmd run dev
if errorlevel 1 pause
