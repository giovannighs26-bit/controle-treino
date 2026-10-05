@echo off
REM Servidor local do Controle de Treino (PWA)
cd /d "%~dp0"
echo Controle de Treino em http://localhost:8080  (feche a janela para parar)
start "" http://localhost:8080
python -m http.server 8080
