# Exit immediately if a command exits with a non-zero status
set -e

# Pull the latest changes from the main branch
git pull origin main

# Install dependencies
npm ci

# Run security scan
npm run security-scan

# Run zero-downtime database migration
npm run migrate

# Build the application
npm run build

# Run automated tests
npm run test

# Run performance tests
npm run performance-test

# Deploy to staging
npm run deploy:staging

# Run smoke tests on staging
npm run test:smoke

# If all tests pass, deploy to production
npm run deploy:production

# Run health check
health_check_url="https://visioncreator.com/api/health"
max_retries=5
retry_interval=10

for i in $(seq 1 $max_retries); do
  response=$(curl -s -o /dev/null -w "%{http_code}" $health_check_url)
  if [ $response -eq 200 ]; then
    echo "Deployment successful. Health check passed."
    exit 0
  else
    echo "Health check failed. Retrying in $retry_interval seconds..."
    sleep $retry_interval
  fi
done

echo "Deployment failed. Health check did not pass after $max_retries attempts."
echo "Rolling back to previous version..."
./scripts/rollback.sh $(git rev-parse HEAD^)
exit 1

