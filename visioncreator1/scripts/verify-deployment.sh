# Exit immediately if a command exits with a non-zero status
set -e

# Configuration
BASE_URL="https://visioncreator.com"
TIMEOUT=5

# Function to check endpoint
check_endpoint() {
    local endpoint=$1
    local expected_status=$2
    local description=$3

    echo "Checking $description..."
    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$BASE_URL$endpoint")

    if [ "$status" -eq "$expected_status" ]; then
        echo "✅ $description: OK (Status $status)"
    else
        echo "❌ $description: FAILED (Expected $expected_status, got $status)"
        exit 1
    fi
}

# Check main page
check_endpoint "/" 200 "Main page"

# Check API health
check_endpoint "/api/health" 200 "API health"

# Check authentication endpoints
check_endpoint "/api/auth/signin" 200 "Sign in page"
check_endpoint "/api/auth/signup" 200 "Sign up page"

# Check non-existent page (should return 404)
check_endpoint "/non-existent-page" 404 "Non-existent page"

# Additional checks
echo "Checking for security headers..."
headers=$(curl -s -I "$BASE_URL" | grep -E "Strict-Transport-Security|X-Frame-Options|X-Content-Type-Options")
if [ -n "$headers" ]; then
    echo "✅ Security headers: OK"
    echo "$headers"
else
    echo "❌ Security headers: FAILED"
    exit 1
fi

echo "Checking SSL certificate..."
ssl_check=$(curl -vI https://visioncreator.com 2>&1 | grep "SSL certificate verify ok")
if [ -n "$ssl_check" ]; then
    echo "✅ SSL certificate: OK"
else
    echo "❌ SSL certificate: FAILED"
    exit 1
fi

echo "All checks passed successfully!"

