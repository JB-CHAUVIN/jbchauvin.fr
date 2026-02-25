#!/usr/bin/env bash
set -e

REMOTE_USER="rocky"
REMOTE_HOST="149.202.79.205"
REMOTE_DIR="/home/rocky/projets/jbchauvin"
APP_NAME="jbchauvin"
PORT=3700

echo "▶ Build..."
npm run build

echo "▶ Déploiement → ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/dist/"
rsync -avz --delete dist/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/dist/"

echo "▶ Redémarrage du serveur sur le port ${PORT}..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" bash <<ENDSSH
  set -e

  # Installer serve et pm2 si absents
  command -v serve &>/dev/null || npm install -g serve
  command -v pm2  &>/dev/null || npm install -g pm2

  # Wrapper shell (évite le bug ESM de PM2 avec serve v14+)
  cat > ${REMOTE_DIR}/serve.sh << 'EOF'
#!/bin/bash
exec serve /home/rocky/projets/jbchauvin/dist -l 3700
EOF
  chmod +x ${REMOTE_DIR}/serve.sh

  # Démarrer ou recharger l'app
  if pm2 describe ${APP_NAME} &>/dev/null; then
    pm2 delete ${APP_NAME}
  fi
  pm2 start ${REMOTE_DIR}/serve.sh --name ${APP_NAME} --interpreter bash
  pm2 save
ENDSSH

echo "✓ Déployé sur http://jbchauvin.fr"
