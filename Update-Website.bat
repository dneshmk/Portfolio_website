@echo off
echo Updating website content from folders...
powershell -ExecutionPolicy Bypass -File generate_content.ps1
echo.
echo Website updated successfully!
pause
