from datetime import datetime, timedelta, timezone

import pandas as pd


# Function to convert timestamps to human-readable format
def humanize_time(timestamp, tz_offset_hours):
    tz_offset = timedelta(hours=tz_offset_hours)
    utc_time = datetime.fromtimestamp(timestamp / 1000, tz=timezone.utc)
    local_time = utc_time + tz_offset
    return local_time.strftime("%Y-%m-%d %H:%M:%S")


# Function to calculate duration in hours
def calculate_duration(start_timestamp, end_timestamp):
    duration_ms = end_timestamp - start_timestamp
    duration_hours = duration_ms / (1000 * 60 * 60)
    return round(duration_hours, 3)


# Sample data structure
data = [
    {
        "startTime": 1725156935534,
        "endTime": 1725164135534,
        "descriptions": [
            "Adjust tests in both website and test repo to be deterministic (still some more to go)",
            "Refactor `safeClick` function to take in an optional `customBase` option",
        ],
        "id": 114,
    },
    {
        "startTime": 1725242153706,
        "endTime": 1725255353706,
        "descriptions": [
            "Keep working on making deterministic tests, both on website and test repo"
        ],
        "id": 115,
    },
    {
        "startTime": 1725550800000,
        "endTime": 1725556840728,
        "descriptions": [
            "Verify whether testing works with production environment (it doesn't yet)",
            "Find out that there are some things going wrong with the tests",
        ],
        "id": 116,
    },
    {
        "startTime": 1725933024150,
        "endTime": 1725941124150,
        "descriptions": ["R&D how public key authentication works (WebAuthn)"],
        "id": 117,
    },
    {
        "startTime": 1726073100000,
        "endTime": 1726080058326,
        "descriptions": [
            "Talk to Daniel about testing, and doing TF necessary to get things working"
        ],
        "id": 118,
    },
    {
        "startTime": 1726160430970,
        "endTime": 1726171230970,
        "descriptions": [
            "Have a call with Daniel about the new way of doing test development (setting up a HTTP server and curling there)"
        ],
        "id": 119,
    },
    {
        "startTime": 1726206300000,
        "endTime": 1726211426717,
        "descriptions": [
            "Try to figure out why tests weren't working",
            "Also try to figure out why environment variables change from .env don't seem to be applied properly",
        ],
        "id": 120,
    },
    {
        "startTime": 1726767300000,
        "endTime": 1726775717171,
        "descriptions": [
            "Have a call with Daniel to discuss testing in dev",
            "Figure out next steps to achieve this",
        ],
        "id": 121,
    },
    {
        "startTime": 1726900200000,
        "endTime": 1726910100000,
        "descriptions": [
            "Figure out what needs to be done to get tests working in dev",
            "Also figure out what needs to be changed to fix things in the cloud",
        ],
        "id": 122,
    },
    {
        "startTime": 1726983000000,
        "endTime": 1726995900000,
        "descriptions": ["Fix things not working in the cloud, still some more TODOs"],
        "id": 123,
    },
    {
        "startTime": 1727108700000,
        "endTime": 1727117735810,
        "descriptions": [
            "Talk to Helene about disabling pam during testing, also about possible dangers of testing with production database",
            "Figure out that tests are failing due to pam being enabled, which sends network requests every so often",
        ],
        "id": 124,
    },
    {
        "startTime": 1727463343731,
        "endTime": 1727466943731,
        "descriptions": [
            "I tried to debug why waitForNetworkIdle is not working, disabling walkme didn't work"
        ],
        "id": 125,
    },
    {
        "startTime": 1727507400000,
        "endTime": 1727527800000,
        "descriptions": [
            "Implement a custom waitForBackendIdle util to address waitForNetworkIdle no longer working",
            "Fix data loader tests to work with the new util",
            "In progress: Do the same thing with custom region draw test",
        ],
        "id": 126,
    },
]

# Timezone offset for UTC+7
tz_offset_hours = 7

# Prepare data for DataFrame
rows = []
for entry in data:
    start_time = humanize_time(entry["startTime"], tz_offset_hours)
    end_time = humanize_time(entry["endTime"], tz_offset_hours)
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
