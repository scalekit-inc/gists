#!/usr/bin/env python3
"""
Basic Scalekit SDK Test - working functionality
"""

import os
import scalekit.client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    """Basic test of Scalekit SDK functionality"""
    
    # Check environment variables
    required_vars = ["SCALEKIT_CLIENT_ID", "SCALEKIT_CLIENT_SECRET", "SCALEKIT_ENV_URL"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return

    try:
        # Initialize Scalekit client
        client = scalekit.client.ScalekitClient(
            client_id=os.getenv("SCALEKIT_CLIENT_ID"),
            client_secret=os.getenv("SCALEKIT_CLIENT_SECRET"),
            env_url=os.getenv("SCALEKIT_ENV_URL"),
        )
        print("✅ Scalekit client initialized successfully")
        
        # Test basic functionality that we know works
        print(f"🔧 Client ID: {client.core_client.client_id}")
        print(f"🌐 Environment URL: {client.core_client.env_url}")
        
        # Test authorization URL generation (this should work)
        try:
            auth_url = client.get_authorization_url(
                redirect_uri="http://localhost:3000/callback",
                state="test_state_123",
                scopes=["openid", "profile", "email"]
            )
            print(f"🔗 Generated authorization URL: {auth_url}")
        except Exception as e:
            print(f"⚠️  Auth URL generation failed: {e}")
            
        # Try listing organizations (if available)
        try:
            print("\n🏢 Testing organization methods...")
            print("Available organization methods:")
            for method in dir(client.organization):
                if not method.startswith('_'):
                    print(f"  - {method}")
        except Exception as e:
            print(f"⚠️  Organization methods failed: {e}")
            
        # Test MCP functionality (this might be working)
        try:
            print(f"\n🤖 MCP client available: {hasattr(client, 'mcp')}")
            if hasattr(client, 'mcp'):
                print("Available MCP methods:")
                for method in dir(client.mcp):
                    if not method.startswith('_'):
                        print(f"  - {method}")
        except Exception as e:
            print(f"⚠️  MCP test failed: {e}")
            
        # Test Connect functionality
        try:
            print(f"\n🔗 Connect client available: {hasattr(client, 'connect')}")
            if hasattr(client, 'connect'):
                print("Available Connect methods:")
                for method in dir(client.connect):
                    if not method.startswith('_'):
                        print(f"  - {method}")
                        
                # Try to list existing connected accounts (might work)
                try:
                    accounts = client.connect.list_connected_accounts()
                    print(f"📋 Found {len(accounts)} existing connected accounts")
                except Exception as e:
                    print(f"⚠️  List connected accounts failed: {e}")
                    
        except Exception as e:
            print(f"⚠️  Connect test failed: {e}")

        print(f"\n🎉 Basic SDK test completed!")
        print(f"💡 The Agent Actions feature may require:")
        print(f"   - Different authorization_details format")
        print(f"   - Additional setup in Scalekit dashboard")
        print(f"   - Different SDK version")
        print(f"   - Contact Scalekit support for Agent Actions setup")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()