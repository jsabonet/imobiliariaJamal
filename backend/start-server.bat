@echo off
echo ========================================
echo  IJPS Imobiliaria - Iniciar Backend
echo ========================================
echo.

cd /d "%~dp0"

echo Ativando ambiente virtual...
call ..\.venv\Scripts\activate.bat

echo.
echo Iniciando servidor Django...
echo URL: http://localhost:8000
echo Admin: http://localhost:8000/admin
echo.
echo Pressione Ctrl+C para parar
echo.

python manage.py runserver

pause
