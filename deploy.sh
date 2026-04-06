#!/bin/bash
set -e

# ── Config ──────────────────────────────────────────────
SERVER="root@187.124.128.228"
REMOTE_DIR="/root/pmhnp-prep"
SSH_PORT=22
REPO="https://github.com/koayeni88/PMHNP-PREP.git"

echo "══════════════════════════════════════════"
echo "  Deploying PMHNP-Prep to Hostinger VPS"
echo "══════════════════════════════════════════"

# ── Step 1: Push latest to GitHub ───────────────────────
echo ""
echo "→ Pushing latest to GitHub..."
git add -A && git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')" 2>/dev/null || true
git push origin main

# ── Step 2: SSH in, pull, build, restart ────────────────
echo ""
echo "→ Updating server from GitHub..."
ssh -p $SSH_PORT "$SERVER" << EOF
  set -e
  cd $REMOTE_DIR

  # Pull latest from GitHub
  git pull origin main

  # Install dependencies
  cd server && npm install --production && cd ..
  cd client && npm install && npm run build && cd ..

  # Generate Prisma client & run migrations
  cd server && npx prisma generate && npx prisma migrate deploy && cd ..

  # Seed database
  cd server && npm run seed && cd ..

  # Restart PM2
  pm2 restart ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs

  echo ""
  echo "✓ Deployment complete!"
  pm2 status
EOF
