#!/bin/sh

echo "--- Instaling  NodeJs dependencies sif they don't exists) ---"
npm install

echo "--- Launching NuxtJS app  ---"
# Lanza la aplicación. --host 0.0.0.0 es crucial para Docker/Caddy.
npm run dev -- --host 0.0.0.0