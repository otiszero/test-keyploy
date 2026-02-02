#!/bin/bash

# Sample API calls for Keploy recording
# Run these while Keploy is in record mode

BASE_URL="http://localhost:5000"

echo "=== Testing Auth APIs ==="

# 1. Register a new user
echo -e "\n[1] Register user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "displayName": "Test User"
  }')
echo "Response: $REGISTER_RESPONSE"

# 2. Login
echo -e "\n[2] Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }')
echo "Response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token, trying alternative extraction..."
  TOKEN=$(echo $LOGIN_RESPONSE | sed 's/.*"accessToken":"\([^"]*\)".*/\1/')
fi

echo "Token: ${TOKEN:0:50}..."

# 3. Get current user profile
echo -e "\n[3] Get profile..."
curl -s -X GET "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# 4. Update profile
echo -e "\n\n[4] Update profile..."
curl -s -X PATCH "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Updated User"
  }'

# 5. Change password
echo -e "\n\n[5] Change password..."
curl -s -X POST "$BASE_URL/auth/change-password" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Test123456",
    "newPassword": "NewTest123456"
  }'

# 6. Register another user for chat testing
echo -e "\n\n[6] Register second user..."
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user2@example.com",
    "password": "Test123456",
    "displayName": "User Two"
  }'

echo -e "\n\n=== API Recording Complete ==="
echo "Note: WebSocket/Chat functionality needs to be tested separately"
echo "The recorded tests are saved in ./keploy directory"
