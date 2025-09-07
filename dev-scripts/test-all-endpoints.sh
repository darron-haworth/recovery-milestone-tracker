#!/bin/bash

# Comprehensive API Testing Script
echo "🧪 Testing All API Endpoints..."
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test
run_test() {
    local test_name="$1"
    local endpoint="$2"
    local method="${3:-GET}"
    local data="${4:-}"
    local headers="${5:-}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "${BLUE}Testing: ${test_name}${NC}"
    echo "Endpoint: ${method} ${endpoint}"
    
    # Build curl command
    local curl_cmd="curl -s -X ${method} ${endpoint}"
    
    if [ ! -z "$data" ]; then
        curl_cmd="${curl_cmd} -d '${data}'"
    fi
    
    if [ ! -z "$headers" ]; then
        curl_cmd="${curl_cmd} ${headers}"
    fi
    
    # Run test
    local response=$(eval $curl_cmd)
    local status_code=$(echo "$response" | tail -n1)
    
    # Check if response contains success or error
    if echo "$response" | grep -q '"success":true\|"status":"OK"'; then
        echo -e "${GREEN}✅ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo "Response: $response" | head -c 200
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    echo ""
}

# Test Health Check
run_test "Health Check" "http://localhost:3000/health"

# Test Authentication Endpoints
run_test "User Signup" "http://localhost:3000/api/auth/signup" "POST" '{"email":"test@example.com","password":"testpass123","displayName":"Test User"}' "-H 'Content-Type: application/json'"

run_test "User Login" "http://localhost:3000/api/auth/login" "POST" '{"email":"test@example.com","password":"testpass123"}' "-H 'Content-Type: application/json'"

# Test User Management
run_test "Get User Profile" "http://localhost:3000/api/user/profile" "GET" "" "-H 'Authorization: Bearer dev-token'"

run_test "Update User Profile" "http://localhost:3000/api/user/profile" "PUT" '{"displayName":"Updated User","bio":"Test bio"}' "-H 'Authorization: Bearer dev-token' -H 'Content-Type: application/json'"

# Test Friends Management
run_test "Get Friends List" "http://localhost:3000/api/friends" "GET" "" "-H 'Authorization: Bearer dev-token'"

run_test "Get Friend Requests" "http://localhost:3000/api/friends/requests" "GET" "" "-H 'Authorization: Bearer dev-token'"

# Test Milestones Management
run_test "Get User Milestones" "http://localhost:3000/api/milestones" "GET" "" "-H 'Authorization: Bearer dev-token'"

run_test "Get Standard Milestones" "http://localhost:3000/api/milestones/standard" "GET" "" "-H 'Authorization: Bearer dev-token'"

# Test Notifications
run_test "Get Notifications" "http://localhost:3000/api/notifications" "GET" "" "-H 'Authorization: Bearer dev-token'"

run_test "Get Unread Count" "http://localhost:3000/api/notifications/unread-count" "GET" "" "-H 'Authorization: Bearer dev-token'"

# Test Data Creation
run_test "Create Test Milestone" "http://localhost:3000/api/milestones" "POST" '{"title":"Test Milestone","description":"A test milestone","daysRequired":7,"category":"weekly"}' "-H 'Authorization: Bearer dev-token' -H 'Content-Type: application/json'"

run_test "Create Test Notification" "http://localhost:3000/api/notifications/test" "POST" "" "-H 'Authorization: Bearer dev-token'"

# Print summary
echo "================================"
echo "🧪 Testing Complete!"
echo ""
echo -e "${GREEN}✅ Passed: ${PASSED_TESTS}${NC}"
echo -e "${RED}❌ Failed: ${FAILED_TESTS}${NC}"
echo -e "${BLUE}📊 Total: ${TOTAL_TESTS}${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Your API is ready for production.${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the errors above before deploying.${NC}"
fi

echo ""
echo "📝 Next steps:"
echo "   1. Fix any failed tests"
echo "   2. Run security audit"
echo "   3. Setup production environment"
echo "   4. Deploy to production server"







