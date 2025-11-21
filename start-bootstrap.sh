#!/bin/sh
set -e

APP_DIR="/usr/src/app"
IMAGE_COPY_DIR="/image-app"
HASH_FILE=".package_hash"

echo "--------------------------------------------------"
echo "  Bootstrap: sync app from image to volume"
echo "--------------------------------------------------"
echo "APP_DIR: $APP_DIR"
echo "IMAGE_COPY_DIR: $IMAGE_COPY_DIR"
echo "--------------------------------------------------"

IMAGE_HASH="none"
VOLUME_HASH="none"

# Hash que ve CUIT a la imatge
if [ -f "$IMAGE_COPY_DIR/$HASH_FILE" ]; then
  IMAGE_HASH=$(cat "$IMAGE_COPY_DIR/$HASH_FILE")
fi

# Hash que hi ha al volum (si existeix)
if [ -f "$APP_DIR/$HASH_FILE" ]; then
  VOLUME_HASH=$(cat "$APP_DIR/$HASH_FILE")
fi

echo "[BOOT] Image hash:  $IMAGE_HASH"
echo "[BOOT] Volume hash: $VOLUME_HASH"

# Si el volum no té hash o és diferent → imatge nova → refresquem tot
if [ "$IMAGE_HASH" != "$VOLUME_HASH" ]; then
  echo "[BOOT] Detected new image version → refreshing app volume"
  mkdir -p "$APP_DIR"

  # Netejar contingut antic del volum
  rm -rf "$APP_DIR"/* "$APP_DIR"/.[!.]* "$APP_DIR"/..?* 2>/dev/null || true

  # Copiar contingut de la imatge cap al volum
  cp -R "$IMAGE_COPY_DIR"/. "$APP_DIR"/
else
  echo "[BOOT] Same version hash → keeping existing volume contents"
fi

cd "$APP_DIR"

if [ ! -f "./start.sh" ]; then
  echo "[ERROR] start.sh not found in $APP_DIR"
  ls -lah
  exit 1
fi

chmod +x ./start.sh

echo "[BOOT] Handing over to start.sh..."
exec sh ./start.sh
