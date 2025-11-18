#!/bin/sh

# Fichero: start.sh
# Ubicación: Directorio raíz

echo "--- Instalando dependencias de Node.js (solo si no existen) ---"
npm install

echo "--- Lanzando Nuxt.js en modo desarrollo (Puerto 3000) ---"
# Lanza la aplicación. --host 0.0.0.0 es crucial para Docker/Caddy.
npm run dev -- --host 0.0.0.0