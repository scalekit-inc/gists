# Agent Actions Examples

Enable AI agents to take actions in third-party applications (Gmail, Calendar, Slack, Notion) on behalf of users using OAuth 2.0 authentication managed by Scalekit.

## Available Examples

### Python Examples
- **`agent-actions-quickstart.py`** - Complete quickstart that authenticates with Gmail and fetches unread emails
  - Uses `scalekit.connect` for managing OAuth connections
  - Demonstrates authorization flow and tool execution
  - Handles Gmail API integration seamlessly

### TypeScript Examples  
- **`m2m-client-authenticating-api.ts`** - Machine-to-machine client authentication API implementation
- **`validate-m2m-client-request.ts`** - Request validation for M2M client authentication

## Quick Start

1. **Install the SDK**
   ```bash
   pip install scalekit-sdk-python
   ```

2. **Set environment variables**
   ```bash
   export SCALEKIT_CLIENT_ID="your_client_id"
   export SCALEKIT_CLIENT_SECRET="your_client_secret"  
   export SCALEKIT_ENV_URL="https://your-domain.scalekit.io"
   ```

3. **Run the example**
   ```bash
   python agent-actions-quickstart.py
   ```

## Key Features

- **Automated OAuth handling** - Scalekit manages all OAuth complexity with third-party providers
- **Pre-built connectors** - Ready-to-use tools for Gmail, Calendar, Slack, Notion
- **Token management** - Automatic access token refresh and expiration handling
- **Simple API** - Use `get_or_create_connected_account()` and `tools.execute()` for everything

## Use Cases

- AI agents reading emails and generating summaries
- Automated calendar scheduling and management  
- Slack notifications and team communication
- Notion page updates and content management
- Service-to-service authentication patterns