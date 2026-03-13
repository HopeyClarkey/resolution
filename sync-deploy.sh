#!/bin/bash

KEY_PATH="/home/alex/Documents/classwork/BiteBytes.pem"

REMOTE_USER="ubuntu"

REMOTE_HOST="ec2-98-92-152-246.compute-1.amazonaws.com"

REMOTE_DIR="~/FavBytes"

echo "--- Local Build & Sync Deployment ---"
echo "Building locally..."
npm run build
echo "Syncing files to server..."

rsync -avz --progress \
    -e "ssh -i $KEY_PATH" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    ./ "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

echo "Restarting application on server..."

ssh -i "$KEY_PATH" "$REMOTE_USER@$REMOTE_HOST" "export PATH=\$PATH:/home/ubuntu/.nvm/versions/node/v20.20.1/bin && cd $REMOTE_DIR && npm install && pm2 restart ecosystem.config.js"

echo "--- Deployment Complete ---"