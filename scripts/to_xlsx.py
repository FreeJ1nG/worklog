import json
import pandas as pd

from datetime import datetime, timedelta, timezone


def offset_time_from_timestamp(timestamp: float, tz_offset: timedelta):
    utc_time = datetime.fromtimestamp(timestamp/1000, tz=timezone.utc)
    return utc_time + tz_offset


def humanize_time(timestamp: float, tz_offset: timedelta):
    local_time = offset_time_from_timestamp(timestamp, tz_offset)
    return local_time.strftime("%Y-%m-%d %H:%M:%S")


def calculate_duration(start_timestamp, end_timestamp):
    duration_ms = end_timestamp - start_timestamp
    duration_hours = duration_ms / (1000 * 60 * 60)
    return round(duration_hours, 3)


# Timezone offset for UTC+7
tz_offset_hours = 7
tz_offset = timedelta(hours=tz_offset_hours)

now = datetime.now(tz=timezone.utc) + tz_offset

month = input("Select the month (1-12), leave empty for current month: ")
year = input("Select the year, leave empty for current year: ")

if not month:
    month = now.month

if not year:
    year = now.year

month, year = int(month), int(year)

f = open("../packages/backend/src/datasource/logs.json", "r")
logs = json.loads(f.read())

data = []
for log in logs:
    start_time = offset_time_from_timestamp(
        int(log["startTime"]), tz_offset)
    end_time = offset_time_from_timestamp(
        int(log["endTime"]), tz_offset)
    if (start_time.month == month and start_time.year == year) or (end_time.month == month and end_time.year == year):
        data.append(log)

print(data)

# Prepare data for DataFrame
rows = []
for entry in data:
    start_time = humanize_time(entry["startTime"], tz_offset)
    end_time = humanize_time(entry["endTime"], tz_offset)
    descriptions = "; ".join(entry["descriptions"])
    duration = calculate_duration(entry["startTime"], entry["endTime"])
    row = {
        "Start Time": start_time,
        "End Time": end_time,
        "Descriptions": descriptions,
        "Duration (hours)": duration,
    }
    rows.append(row)

# Create DataFrame
df = pd.DataFrame(rows)

# Save to Excel
df.to_excel("output.xlsx", index=False)

print("Data has been written to output.xlsx")
