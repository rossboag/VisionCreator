# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting promotion process from staging to production..."

# Ensure we're on the staging branch
git checkout staging

# Ensure the staging branch is up to date
git pull origin staging

# Merge staging into main
git checkout main
git merge staging

# Push changes to main
git push origin main

# Deploy to production
./scripts/deploy-production.sh

echo "Promotion process completed. Staging has been promoted to production."

