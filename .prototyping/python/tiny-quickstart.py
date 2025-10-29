import os
import sys
import json
from datetime import datetime
from dotenv import load_dotenv
import scalekit.client

load_dotenv()

scalekit = scalekit.client.ScalekitClient(
    client_id=os.getenv("SCALEKIT_CLIENT_ID"),
    client_secret=os.getenv("SCALEKIT_CLIENT_SECRET"),
    env_url=os.getenv("SCALEKIT_ENV_URL"),
)
connect = scalekit.connect
link_response = scalekit.connect.get_authorization_link(
    connection_name="GMAIL",
    identifier="default",
)
print("click on the link to authorize", link_response.link)
input("Press Enter after authorizing...")

current_tool = "gmail_fetch_mails"

response = scalekit.connect.execute_tool(
    tool_name=current_tool,
    identifier="default",
    tool_input={
        "max_results": 1
    },
)


def format_response(response, tool_name=None):
    """Generic response formatter that handles different tool types"""

    # Detect tool type from tool_name or response data
    if tool_name:
        tool_type = tool_name.lower()
    elif hasattr(response, 'data') and response.data:
        if 'events' in response.data:
            tool_type = 'calendar'
        elif 'messages' in response.data:
            tool_type = 'email'
        elif 'files' in response.data:
            tool_type = 'drive'
        else:
            tool_type = 'generic'
    else:
        tool_type = 'generic'

    print("\n" + "="*60)

    if 'calendar' in tool_type:
        format_calendar_response(response)
    elif 'mail' in tool_type or 'email' in tool_type:
        format_email_response(response)
    elif 'drive' in tool_type or 'file' in tool_type:
        format_drive_response(response)
    else:
        format_generic_response(response, tool_name)


def format_calendar_response(response):
    """Format calendar-specific response"""
    print("📅 GOOGLE CALENDAR EVENTS")
    print("="*60)

    if hasattr(response, 'data') and response.data:
        events = response.data.get('events', [])
        calendar_id = response.data.get('calendar_id', 'Unknown')

        print(f"📋 Calendar: {calendar_id}")
        print(f"🔢 Found {len(events)} event(s)")

        if response.data.get('next_page_token'):
            print(f"📄 Next page token available")

        print("\n" + "-"*40)

        for i, event in enumerate(events, 1):
            print(f"\n🎯 Event #{i}")
            print(f"   📝 Title: {event.get('summary', 'No title')}")

            # Format start time
            start = event.get('start', {})
            if 'dateTime' in start:
                start_time = datetime.fromisoformat(
                    start['dateTime'].replace('Z', '+00:00'))
                print(
                    f"   ⏰ Start: {start_time.strftime('%Y-%m-%d %H:%M %Z')}")

            # Format end time
            end = event.get('end', {})
            if 'dateTime' in end:
                end_time = datetime.fromisoformat(
                    end['dateTime'].replace('Z', '+00:00'))
                print(f"   ⏰ End: {end_time.strftime('%Y-%m-%d %H:%M %Z')}")

            # Organizer
            organizer = event.get('organizer', {})
            if organizer.get('email'):
                print(f"   👤 Organizer: {organizer['email']}")

            # Description (truncated for readability)
            description = event.get('description', '')
            if description:
                clean_desc = description.replace('<br>', ' ').replace(
                    '<a href="', '').replace('">', ' ').replace('</a>', '')
                if len(clean_desc) > 100:
                    clean_desc = clean_desc[:100] + "..."
                print(f"   📄 Description: {clean_desc}")

            # Attendees count
            attendees = event.get('attendees', [])
            if attendees:
                print(f"   👥 Attendees: {len(attendees)} people")

            # Status
            status = event.get('status', 'unknown')
            status_emoji = "✅" if status == "confirmed" else "❓"
            print(f"   {status_emoji} Status: {status.title()}")


def format_email_response(response):
    """Format email-specific response"""
    print("📧 EMAIL MESSAGES")
    print("="*60)

    if hasattr(response, 'data') and response.data:
        messages = response.data.get('messages', [])
        print(f"📬 Found {len(messages)} message(s)")

        for i, msg in enumerate(messages, 1):
            print(f"\n📨 Message #{i}")
            print(f"   🆔 ID: {msg.get('id', 'N/A')}")
            if 'snippet' in msg:
                print(f"   📄 Preview: {msg['snippet'][:100]}...")
            if 'subject' in msg:
                print(f"   📝 Subject: {msg['subject']}")


def format_drive_response(response):
    """Format Google Drive-specific response"""
    print("💾 GOOGLE DRIVE FILES")
    print("="*60)

    if hasattr(response, 'data') and response.data:
        files = response.data.get('files', [])
        print(f"📁 Found {len(files)} file(s)")

        for i, file in enumerate(files, 1):
            print(f"\n📄 File #{i}")
            print(f"   📝 Name: {file.get('name', 'Unknown')}")
            print(f"   🆔 ID: {file.get('id', 'N/A')}")
            if 'mimeType' in file:
                print(f"   📋 Type: {file['mimeType']}")


def format_generic_response(response, tool_name=None):
    """Generic fallback formatter for unknown tool types"""
    tool_display = tool_name.upper() if tool_name else "TOOL EXECUTION"
    print(f"🔧 {tool_display} RESULT")
    print("="*60)

    if hasattr(response, 'data') and response.data:
        data = response.data
        if isinstance(data, dict):
            # Show key statistics
            print(f"📊 Response contains {len(data)} field(s)")

            # Show top-level keys
            for key, value in list(data.items())[:5]:  # Limit to first 5 keys
                if isinstance(value, list):
                    print(f"   📋 {key}: {len(value)} item(s)")
                elif isinstance(value, dict):
                    print(f"   📁 {key}: {len(value)} field(s)")
                else:
                    value_str = str(value)
                    if len(value_str) > 50:
                        value_str = value_str[:50] + "..."
                    print(f"   📄 {key}: {value_str}")

            if len(data) > 5:
                print(f"   ... and {len(data) - 5} more field(s)")
        else:
            print(f"📄 Result: {str(data)[:200]}...")

    print("\n" + "="*60)
    print(f"✅ Tool execution completed successfully!")

    if hasattr(response, 'execution_id'):
        print(f"🔍 Execution ID: {response.execution_id}")
    print("="*60)


# Auto-detect tool type and format accordingly
format_response(response, current_tool)
