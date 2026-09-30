@echo off
echo ========================================================
echo  Starting PHC-Connect FastAPI Backend (Port 8000)
echo ========================================================
cd /d "%~dp0backend"
if not exist "venv\Scripts\python.exe" (
    echo Creating Python virtual environment...
    python -m venv venv
    call venv\Scripts\pip.exe install -r requirements.txt
)
echo Launching Uvicorn server at http://localhost:8000 ...
set PYTHONPATH=.
venv\Scripts\uvicorn.exe main:app --reload --host 0.0.0.0 --port 8000
pause
