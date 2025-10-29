## Client Credentials OAuth 2.0 Flow with cURL

### 1. Get Access Token

```bash
# Set your environment variables
export SCALEKIT_CLIENT_ID="your_client_id"
export SCALEKIT_CLIENT_SECRET="your_client_secret"
export SCALEKIT_ENVIRONMENT_URL="https://your-env.scalekit.cloud"

# Get access token using client credentials flow
curl -X POST "${SCALEKIT_ENVIRONMENT_URL}/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=${SCALEKIT_CLIENT_ID}" \
  -d "client_secret=${SCALEKIT_CLIENT_SECRET}" \
  -d "scope=openid email profile"
```

### 2. Extract Token and Make Authenticated Request

```bash
# Store the token response and extract access_token
TOKEN_RESPONSE=$(curl -s -X POST "${SCALEKIT_ENVIRONMENT_URL}/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=${SCALEKIT_CLIENT_ID}" \
  -d "client_secret=${SCALEKIT_CLIENT_SECRET}" \
  -d "scope=openid email profile")

# Extract access token using jq (install jq if not available)
ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')

# Make authenticated API request
curl -X GET "${SCALEKIT_ENVIRONMENT_URL}/api/v1/organizations" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}"
```

### 3. Complete One-liner Script

```bash
#!/bin/bash

# Configuration
SCALEKIT_CLIENT_ID="your_client_id"
SCALEKIT_CLIENT_SECRET="your_client_secret"
SCALEKIT_ENVIRONMENT_URL="https://your-env.scalekit.cloud"

# Get token and make authenticated request in one go
ACCESS_TOKEN=$(curl -s -X POST "${SCALEKIT_ENVIRONMENT_URL}/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=${SCALEKIT_CLIENT_ID}" \
  -d "client_secret=${SCALEKIT_CLIENT_SECRET}" \
  -d "scope=openid email profile" | jq -r '.access_token')

# Use the token for API requests
curl -X GET "${SCALEKIT_ENVIRONMENT_URL}/api/v1/organizations" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json"
```

### 4. Alternative without jq dependency

If you don't have `jq` installed, you can use `grep` and `sed`:

```bash
# Extract access token without jq
ACCESS_TOKEN=$(curl -s -X POST "${SCALEKIT_ENVIRONMENT_URL}/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=${SCALEKIT_CLIENT_ID}" \
  -d "client_secret=${SCALEKIT_CLIENT_SECRET}" \
  -d "scope=openid email profile" | \
  grep -o '"access_token":"[^"]*' | \
  sed 's/"access_token":"//')
```
