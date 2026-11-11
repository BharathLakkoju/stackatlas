#!/usr/bin/env bash
set -euo pipefail
corepack enable
corepack prepare pnpm@10.33.4 --activate
if [[ -f pnpm-lock.yaml ]] && head -1 pnpm-lock.yaml | grep -qE '^(workspace:|@file:)'; then
  rm -f pnpm-lock.yaml
fi
if [[ ! -f pnpm-lock.yaml ]]; then
  pnpm install
else
  pnpm install --frozen-lockfile
fi
