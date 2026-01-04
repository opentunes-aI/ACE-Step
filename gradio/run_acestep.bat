@echo off
REM ACE-Step Launcher
REM This script activates the virtual environment and launches ACE-Step
REM with the model path set to "G:\My Drive\models"

echo Starting ACE-Step...
call ..\venv\Scripts\activate

REM Launch ACE-Step
REM You can add optimizing flags here if needed, e.g.:
REM --torch_compile true --cpu_offload true --overlapped_decode true
acestep --checkpoint_path "G:\My Drive\models"

pause
