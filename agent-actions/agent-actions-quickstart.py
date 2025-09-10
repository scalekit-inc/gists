#!/usr/bin/env python3
"""
Scalekit Agent Actions Quickstart Example

This script demonstrates how to use Scalekit Agent Actions to enable AI agents
to take actions in third-party applications (Gmail, Calendar, Slack, Notion) 
on behalf of users using OAuth 2.0 authentication.

Prerequisites:
- pip install scalekit-sdk-python
- Set environment variables: SCALEKIT_CLIENT_ID, SCALEKIT_CLIENT_SECRET, SCALEKIT_ENV_URL
"""

import os
import sys
import scalekit.client


def main():
    """
    Agent Actions quickstart - fetches last 5 unread emails from Gmail
    """
    
    # Check environment variables
    required_vars = ["SCALEKIT_CLIENT_ID", "SCALEKIT_CLIENT_SECRET", "SCALEKIT_ENV_URL"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        print("Please set these variables before running the script.")
        return

    # Initialize Scalekit client
    try:
        scalekit = scalekit.client.ScalekitClient(
            client_id=os.getenv("SCALEKIT_CLIENT_ID"),
            client_secret=os.getenv("SCALEKIT_CLIENT_SECRET"),
            env_url=os.getenv("SCALEKIT_ENV_URL"),
        )
        connect = scalekit.connect
        print("✅ Scalekit client initialized successfully")
    except Exception as e:
        print(f"❌ Error initializing Scalekit client: {e}")
        return

    try:
        # Step 1: Create or get connected account for Gmail
        print("\n🔗 Step 1: Creating connected account for Gmail...")
        connected_account = connect.get_or_create_connected_account(
            connection_name="gmail",
            identifier="user_123"
        )
        print(f"✅ Connected account ID: {connected_account.id}")

        # Step 2: Check authorization status and get authorization link if needed
        print(f"\n🔐 Step 2: Checking authorization status...")
        print(f"Account status: {connected_account.status}")
        
        if connected_account.status != "ACTIVE":
            print("⚠️  Gmail connection not active. User needs to authorize.")
            
            link_response = connect.get_authorization_link(
                connection_name="gmail",
                identifier="user_123"
            )
            
            print(f"🔗 Authorization URL: {link_response.link}")
            print("👆 Click the link above to authorize Gmail access")
            input("⌨️  Press Enter after completing authorization...")
            
            # Re-check the connected account status after authorization
            connected_account = connect.get_or_create_connected_account(
                connection_name="gmail",
                identifier="user_123"
            )
            print(f"Updated account status: {connected_account.status}")

        # Step 3: Execute Gmail tool to fetch emails
        if connected_account.status == "ACTIVE":
            print(f"\n📧 Step 3: Fetching unread emails...")
            
            emails = connect.tools.execute(
                connected_account_id=connected_account.id,
                tool='gmail_fetch_mails',
                parameters={
                    'query': 'is:unread',
                    'max_results': 5
                }
            )
            
            print(f"✅ Successfully fetched emails!")
            print(f"📊 Result: {emails.result}")
            
            # Display email summary if available
            if hasattr(emails, 'result') and emails.result:
                messages = emails.result.get('messages', [])
                print(f"📬 Found {len(messages)} unread emails")
                for i, msg in enumerate(messages[:5], 1):
                    print(f"  {i}. Message ID: {msg.get('id', 'N/A')}")
        else:
            print("❌ Gmail connection still not active. Please try authorization again.")

    except Exception as e:
        print(f"❌ Error in workflow: {e}")
        return

    print("\n🎉 Agent Actions quickstart completed successfully!")
    print("💡 Next steps: Try the Agentic Tool Calling guide with LLM integration")




if __name__ == "__main__":
    main()