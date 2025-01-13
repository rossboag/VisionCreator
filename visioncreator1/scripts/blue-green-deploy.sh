# Exit immediately if a command exits with a non-zero status
set -e

# Determine current active environment
if curl -s http://localhost:3000/api/health | grep -q "OK"; then
  current="blue"
  next="green"
  current_port=3000
  next_port=3001
else
  current="green"
  next="blue"
  current_port=3001
  next_port=3000
fi

echo "Current active environment: $current"
echo "Deploying to: $next"

# Deploy to next environment
git pull origin main
npm ci
npm run build
pm2 reload visioncreator-$next --update-env

# Wait for new environment to be ready
echo "Waiting for new environment to be ready..."
until curl -s http://localhost:$next_port/api/health | grep -q "OK"
do
  sleep 5
done

# Switch traffic to new environment
echo "Switching traffic to $next environment"
sudo nginx -s reload

# Wait for old environment connections to drain
echo "Waiting for connections to drain from $current environment..."
sleep 30

# Stop old environment
pm2 stop visioncreator-$current

echo "Deployment complete. New active environment: $next"

