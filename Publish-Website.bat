@echo off
echo ========================================================
echo   PUBLISHING TO GITHUB...
echo ========================================================

:: 1. Add all changes
echo [1/3] Adding changes...
git add .

:: 2. Commit with a timestamp
echo [2/3] Committing...
set timestamp=%DATE% %TIME%
git commit -m "Website Update: %timestamp%"

:: 3. Push to GitHub
echo [3/3] Uploading to GitHub...
git push origin main

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo   SUCCESS! Your website is updating.
    echo   It may take 1-2 minutes to appear online.
) else (
    echo   ERROR: Something went wrong.
    echo   Did you do the 'One-Time Setup' first?
    echo   Check deployment.md for help.
)
echo ========================================================
pause
