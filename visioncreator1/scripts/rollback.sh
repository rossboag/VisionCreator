# Exit immediately if a command exits with a non-zero status
set -e

ENVIRONMENT=$1
ROLLBACK_VERSION=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$ROLLBACK_VERSION" ]; then
  echo "Usage: ./rollback.sh <environment> <version>"
  exit 1
fi

echo "Starting rollback process for $ENVIRONMENT to version $ROLLBACK_VERSION..."

# Navigate to the project directory
cd /path/to/visioncreator-$ENVIRONMENT

# Checkout the specified version
git checkout $ROLLBACK_VERSION

# Install dependencies
npm ci --only=production

# Run database migrations (down)
NODE_ENV=$ENVIRONMENT npm run prisma:migrate:down

# Build the application
NODE_ENV=$ENVIRONMENT npm run build

# Restart the application
pm2 reload ecosystem.config.js --env $ENVIRONMENT

# Run post-rollback verification
BASE_URL="https://$ENVIRONMENT.visioncreator.com" ./scripts/verify-deployment.sh

if [ $? -eq 0 ]; then
    echo "✅ Rollback successful!"
else
    echo "❌ Rollback verification failed. Manual intervention required."
    exit 1
fi

echo "Rollback process completed."

