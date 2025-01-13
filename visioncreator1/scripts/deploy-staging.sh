# Exit immediately if a command exits with a non-zero status
set -e

# Navigate to the project directory
cd /path/to/visioncreator-staging

echo "Starting staging deployment process..."

# Pull the latest changes from the staging branch
echo "Pulling latest changes..."
git pull origin staging

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run database migrations
echo "Running database migrations..."
NODE_ENV=staging npm run prisma:migrate

# Build the application
echo "Building the application..."
NODE_ENV=staging npm run build

# Run tests
echo "Running tests..."
NODE_ENV=staging npm run test

# Restart the application
echo "Restarting the application..."
pm2 reload ecosystem.config.js --env staging

# Run post-deployment verification
echo "Running post-deployment verification..."
BASE_URL="https://staging.visioncreator.com" ./scripts/verify-deployment.sh

if [ $? -eq 0 ]; then
    echo "✅ Staging deployment successful!"
else
    echo "❌ Staging deployment verification failed. Rolling back..."
    git reset --hard HEAD^
    npm ci
    NODE_ENV=staging npm run build
    pm2 reload ecosystem.config.js --env staging
    exit 1
fi

echo "Staging deployment process completed."

