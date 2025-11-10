#!/usr/bin/env python3
"""
Debug script to explore the Scalekit SDK and see available methods
"""

import os
import scalekit.client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def main():
    try:
        # Initialize client
        client = scalekit.client.ScalekitClient(
            client_id=os.getenv("SCALEKIT_CLIENT_ID"),
            client_secret=os.getenv("SCALEKIT_CLIENT_SECRET"),
            env_url=os.getenv("SCALEKIT_ENV_URL"),
        )
        
        print("✅ Client initialized successfully")
        
        # Explore available attributes
        print("\n🔍 Available client attributes:")
        for attr in dir(client):
            if not attr.startswith('_'):
                print(f"  - {attr}")
        
        # Check if connect exists
        if hasattr(client, 'connect'):
            print(f"\n🔗 Connect object type: {type(client.connect)}")
            print("Available connect methods:")
            for method in dir(client.connect):
                if not method.startswith('_'):
                    print(f"  - {method}")
                    
        # Try to see the method signature
        if hasattr(client.connect, 'get_or_create_connected_account'):
            import inspect
            sig = inspect.signature(client.connect.get_or_create_connected_account)
            print(f"\n📝 get_or_create_connected_account signature: {sig}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()