#!/usr/bin/env bash
# Servidor local do Controle de Treino (PWA) — abra http://localhost:8080
cd "$(dirname "$0")" || exit 1
echo "Controle de Treino em http://localhost:8080  (Ctrl+C para parar)"
python3 -m http.server 8080
