# Exit immediately if a command exits with a non-zero status
set -e

# Function to update deployment status and send notification
update_status_and_notify() {
  curl -X POST -H "Content-Type: application/json" -d "{\"status\":\"$1\"}" https://visioncreator.vercel.app/api/deployment-status
  npx ts-node -e "import { sendEmail } from './lib/email'; sendEmail(process.env.TEAM_EMAIL, 'Deployment Status Update', '$1');"
}

echo "Starting deployment process..."
update_status_and_notify "Starting deployment"

# Check environment variables
echo "Checking environment variables..."
update_status_and_notify "Checking environment variables"
npx ts-node scripts/check-env-vars.ts

# Run TypeScript type checking
echo "Running TypeScript type checking..."
npm run type-check

# Run linting
echo "Running linter..."
npm run lint

# Run tests
echo "Running tests..."
npm run test

# If any of the above commands fail, exit the script
if [ $? -ne 0 ]; then
  echo "Pre-deployment checks failed. Aborting deployment."
  update_status_and_notify "Deployment failed: Pre-deployment checks failed"
  exit 1
fi

# Run through pre-deployment checklist
echo "Running pre-deployment checklist..."
update_status_and_notify "Running pre-deployment checklist"
while IFS= read -r line; do
  if [[ $line == "- [ ]"* ]]; then
    item="${line#- [ ] }"
    read -p "❓ Have you completed: $item (y/n)? " yn
    case $yn in
      [Yy]* ) echo "✅ $item: Completed";;
      * ) echo "❌ $item: Not completed. Please complete this item before proceeding."; update_status_and_notify "Deployment failed: Pre-deployment checklist incomplete"; exit 1;;
    esac
  fi
done < docs/pre-deployment-checklist.md

# Deploy to Vercel
echo "Deploying to Vercel..."
update_status_and_notify "Deploying to Vercel"
vercel --prod

# Run post-deployment verification
echo "Running post-deployment verification..."
update_status_and_notify "Running post-deployment verification"
./scripts/verify-deployment.sh

if [ $? -eq 0 ]; then
  echo "✅ Deployment successful!"
  update_status_and_notify "Deployment successful"
else
  echo "❌ Deployment verification failed."
  update_status_and_notify "Deployment failed: Verification failed"
  exit 1
fi

echo "Deployment process completed."
update_status_and_notify "Deployment process completed"

