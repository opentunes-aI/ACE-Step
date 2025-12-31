@echo off
echo Starting Backend API...
start "ACE-Step API" cmd /k "call run_api.bat"

echo Starting Frontend Studio...
cd acestep_studio
npm run dev
pause
