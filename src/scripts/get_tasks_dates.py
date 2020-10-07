import dateutil.parser as dp
import requests
import time
import json

beirutId = 9164

projURL = "https://tasking-manager-tm4-production-api.hotosm.org/api/v2/projects/{}/tasks/"
taskURL = "https://tasking-manager-tm4-production-api.hotosm.org/api/v2/projects/{}/tasks/{}/"

output = "../data/tasks.geojson"

def iso_to_unix(iso):
    return int(dp.parse(iso).timestamp())
##
## Get Project Tasks
##

print("Getting Project Tasks...")

proj_req = requests.get(projURL.format(beirutId))
proj = proj_req.json()

##
## Loop thru tasks

for i, task in enumerate(proj["features"]):
    task_id = task["properties"]["taskId"]
    task_req = requests.get(taskURL.format(beirutId, task_id))
    task = task_req.json()

    ## Get validated date
    for j, event in enumerate(task["taskHistory"]):
        if event["actionText"] == "VALIDATED":
            date_validated = iso_to_unix(event["actionDate"])
            break

    ## Get mapped date
    for k, event in enumerate(task["taskHistory"]):
        if event["actionText"] == "MAPPED":
            date_mapped = iso_to_unix(event["actionDate"])
            break

    proj["features"][i]["properties"] = {
        "taskId": task_id,
        "dateMapped": date_mapped,
        "dateValidated": date_validated
    }

    print("Processed Task {}".format(task_id))
    time.sleep(0.1) # Be nice to HOT TM API

##
## Output

pretty_json = json.dumps(proj, indent=2)

with open(output, 'w') as f:
    f.write(pretty_json)
