#!/usr/bin/env python3

import geopandas as gpd
import json

aug4 = 1596499200 * 1000
aug10 = 1597017600 * 1000
sep23 = 1600819200 * 1000
daySec = 86400 * 1000

sep4 = 1599177600 * 1000
num_bldg_sep4 = 54155

stats = {
    date: {
        "num_bldg": -1,
        "pct_mapped": -1,
        "pct_validated": -1
    }
    for date in range(aug4, sep23+1, daySec)
}

for date in range(aug4, sep23+1, daySec):
    m = num_bldg_sep4 / ((sep4-aug4)/daySec) # buildings per day

    ## Assume linear increase in buildings until stats end sep4
    ## No buildings mapped until task created aug 10
    if date <= aug10:
        stats[date]["num_bldg"] = 0
    elif date <= sep4:
        stats[date]["num_bldg"] = round(m * ((date - aug10)/daySec))
    else:
        stats[date]["num_bldg"] = 54155

##

tasks = gpd.GeoDataFrame.from_file("../data/tasks.geojson")
num_tasks = len(tasks)

for date, stat in stats.items():
    pct_mapped = round((len(tasks[tasks["dateMapped"]*1000 <= int(date)]) / num_tasks) *100)
    pct_validated = round((len(tasks[tasks["dateValidated"]*1000 <= int(date)]) / num_tasks) * 100)

    stats[date]["pct_mapped"] = pct_mapped
    stats[date]["pct_validated"] = pct_validated


with open("../data/stats.json", "w") as json_file:
    json_file.write(json.dumps(stats, indent=2))
