# Agent Actions Python Testing

Quick setup to test the Agent Actions Python example.

## Setup

1. Create and activate virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your Scalekit credentials:
   - Get these from your Scalekit Dashboard
   - Update `SCALEKIT_CLIENT_ID`, `SCALEKIT_CLIENT_SECRET`, `SCALEKIT_ENV_URL`

5. Run the script:
   ```bash
   python agent-actions-quickstart.py
   ```

## Note
The virtual environment (`venv/`) is already created and has the Scalekit SDK installed. Just activate it and run!

## What it does

- Creates a Gmail connected account for user "user_123"
- Checks authorization status
- If not authorized, provides a link for user consent
- Once authorized, fetches the last 5 unread emails
- Displays email count and message IDs