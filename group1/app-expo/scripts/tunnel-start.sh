#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! npx expo whoami >/dev/null 2>&1; then
  echo "[warn] Belum login Expo CLI. Jalankan 'npx expo login' dulu (sekali saja) sebelum pakai script ini."
  exit 1
fi

echo "[info] Bersihin cache Expo di WSL..."
rm -rf "${HOME}/.expo" || true

if command -v powershell.exe >/dev/null 2>&1; then
  echo "[info] Bersihin cache Expo di Windows..."
  powershell.exe -NoProfile -Command "if (Test-Path \$env:USERPROFILE\\.expo) { Remove-Item \$env:USERPROFILE\\.expo -Recurse -Force }" || true
fi

echo "[info] Start Expo (tunnel, port 8080)..."
cd "${REPO_DIR}"
npm run start
