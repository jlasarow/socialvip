#!/usr/bin/env bash
set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "📁 Working in: $REPO_DIR"
cd "$REPO_DIR"

# Remove stale git lock if it exists
if [ -f ".git/index.lock" ]; then
  echo "🔓 Removing stale git lock file..."
  rm -f .git/index.lock
fi

# Init git if needed (shouldn't be, but just in case)
if [ ! -d ".git" ]; then
  git init
fi

# Configure git identity
git config user.email "jlasarow@gmail.com"
git config user.name "Judd Lasarow"

# Rename branch to main
git branch -M main 2>/dev/null || true

# Regenerate lock file without Stripe packages
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Stage everything (exclude node_modules via .gitignore)
git add -A

# Commit
if git diff --cached --quiet; then
  echo "✅ Nothing new to commit (already committed)"
else
  git commit -m "Initial commit: SocialVIP members club booking app (no Stripe)"
fi

# Add remote (skip if already exists)
if ! git remote get-url origin &>/dev/null; then
  git remote add origin https://github.com/jlasarow/socialvip.git
  echo "🔗 Remote added"
else
  echo "🔗 Remote already set: $(git remote get-url origin)"
fi

# Push!
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Done! Code is live at https://github.com/jlasarow/socialvip"
echo ""
echo "Next steps:"
echo "  1. Go to https://vercel.com → New Project → import jlasarow/socialvip"
echo "  2. Add these env vars (from .env.local):"
echo "       NEXT_PUBLIC_SUPABASE_URL"
echo "       NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "       SUPABASE_SERVICE_ROLE_KEY"
echo "       NEXT_PUBLIC_APP_URL  (set to your Vercel URL, e.g. https://socialvip.vercel.app)"
echo "  3. Deploy!"
