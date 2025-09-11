import os
import sys
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
    connection_name="GoogleCal",
    identifier="default",
)
print("click on the link to authorize gmail", link_response.link)
input("Press Enter after authorizing gmail...")

response = scalekit.connect.execute_tool(
    tool_name="googlecalendar_list_events",
    identifier="default",
    tool_input={
        "max_results": 1
    },
)

print(response)
