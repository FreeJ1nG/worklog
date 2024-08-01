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
        "startTime": 1719827100000,
        "endTime": 1719832500000,
        "descriptions": ["Debug digest auth in CF"],
        "id": 31,
    },
    {
        "startTime": 1719886500000,
        "endTime": 1719889200000,
        "descriptions": ["Debug digest auth in CF"],
        "id": 32,
    },
    {
        "startTime": 1719907200000,
        "endTime": 1719916200000,
        "descriptions": [
            "Finally figure out the bug: _parseDigestHeader implementing .reduce improperly",
            "Also figure out that there's still something wrong with access by credentials",
        ],
        "id": 33,
    },
    {
        "startTime": 1719935040000,
        "endTime": 1719939540000,
        "descriptions": [
            "Discuss future plans with Daniel",
            "Decide that adding CloudFront logging will be the next step",
        ],
        "id": 34,
    },
    {
        "startTime": 1719979200000,
        "endTime": 1719990000000,
        "descriptions": [
            "Read different ways for logging CloudFront",
            "Discover that the current CloudFront functions have a CloudWatch already setup",
        ],
        "id": 35,
    },
    {
        "startTime": 1720444500000,
        "endTime": 1720446300000,
        "descriptions": ["Debug digest authentication"],
        "id": 36,
    },
    {
        "startTime": 1720477800000,
        "endTime": 1720483200000,
        "descriptions": [
            "Have a meeting with the team, Helene, Robert, Daniel, Kevin, Almog",
            "Debug digest auth",
        ],
        "id": 37,
    },
    {
        "startTime": 1720507500000,
        "endTime": 1720515600000,
        "descriptions": [
            "Debug digest auth",
            "Explore hardware based authentication (yubikey)",
        ],
        "id": 38,
    },
    {
        "startTime": 1720546200000,
        "endTime": 1720553400000,
        "descriptions": [
            "Change digest auth to basic auth (with salted + hashed password storage)",
            "Leave comments on bitbucket issue relating to decisions that have been made",
        ],
        "id": 39,
    },
    {
        "startTime": 1720602000000,
        "endTime": 1720605600000,
        "descriptions": ["Verify that the AWS CLI for CloudFront logging works"],
        "id": 40,
    },
    {
        "startTime": 1720625340000,
        "endTime": 1720630740000,
        "descriptions": [
            "Setup developer shell, containers, certs, etc",
            "https://policymap.atlassian.net/browse/PR-2046",
        ],
        "id": 41,
    },
    {
        "startTime": 1720681200000,
        "endTime": 1720686600000,
        "descriptions": ["Read up on hardware authentication (YubiKey with WebAuthn)"],
        "id": 42,
    },
    {
        "startTime": 1720747800000,
        "endTime": 1720757700000,
        "descriptions": [
            "Almost finish setting up shell, discuss a lot of git processes in that happens in PolicyMap",
            "Discussions with Daniel regarding Vite chunking and warmup",
        ],
        "id": 43,
    },
    {
        "startTime": 1720790940000,
        "endTime": 1720803540000,
        "descriptions": [
            "Finally merge password hashing PR",
            "Look into some of the CloudFront Terraform setup",
            "Do R&D on Vite server warmup",
        ],
        "id": 44,
    },
    {
        "startTime": 1720918800000,
        "endTime": 1720925100000,
        "descriptions": [
            "Explore Vite HMR and possible ways to serve bundled JS files instead of having a lot of JS files served through dev mode"
        ],
        "id": 45,
    },
    {
        "startTime": 1721017800000,
        "endTime": 1721038500000,
        "descriptions": [
            "Explore what makes website load so slowly",
            "https://policymap.atlassian.net/browse/PR-2049",
            "Discover that SCSS is the thing that's causing load to be slow",
        ],
        "id": 46,
    },
    {
        "startTime": 1721043900000,
        "endTime": 1721055600000,
        "descriptions": [
            "Created a PR for the R&D I did",
            "Figure out that there's a Vite option called css.preprocessorMaxWorkers",
            "Reduce the transform time for SCSS files by around 30%ish (not 100% sure, need to benchmark)",
        ],
        "id": 47,
    },
    {
        "startTime": 1721108400000,
        "endTime": 1721116500000,
        "descriptions": [
            "Setup and explore rsync with Daniel",
            "Start setting up DB for my dev environment",
        ],
        "id": 48,
    },
    {
        "startTime": 1721134800000,
        "endTime": 1721141100000,
        "descriptions": [
            "Finish setting up rsync",
            "Do R&D on git remote & local methodology",
        ],
        "id": 49,
    },
    {
        "startTime": 1721198700000,
        "endTime": 1721209500000,
        "descriptions": [
            "Do further setting up of my shell with DB",
            "Create OpenAthens account, and testing whether things work",
        ],
        "id": 50,
    },
    {
        "startTime": 1721237400000,
        "endTime": 1721241900000,
        "descriptions": [
            "Create a ticket for a new task: https://policymap.atlassian.net/browse/PR-2052",
            "Discuss how to tackle and implement the ticket",
        ],
        "id": 51,
    },
    {
        "startTime": 1721284200000,
        "endTime": 1721296800000,
        "descriptions": [
            "Explore boto3 library",
            "Create ticket subtasks: https://policymap.atlassian.net/browse/PR-2052",
            "Start implementing functionalities according to ticket",
        ],
        "id": 52,
    },
    {
        "startTime": 1721300400000,
        "endTime": 1721307600000,
        "descriptions": [
            "Implement new features for sg-updater",
            "https://bitbucket.org/policymap/sg-updater/pull-requests/1",
            "TODO: Implement `reboot` feature",
        ],
        "id": 53,
    },
    {
        "startTime": 1721363400000,
        "endTime": 1721372400000,
        "descriptions": [
            "Implement reboot feature + org terraform to allow user to do EC2 operations"
        ],
        "id": 54,
    },
    {
        "startTime": 1721384100000,
        "endTime": 1721385900000,
        "descriptions": [
            "Do finishing touches on PR",
            "https://bitbucket.org/policymap/sg-updater/pull-requests/1",
        ],
        "id": 55,
    },
    {
        "startTime": 1721393940000,
        "endTime": 1721404740000,
        "descriptions": [
            "Review PR with Daniel",
            "Discuss next ticket to do",
            "Start R&D on Turbopack",
            "R&D SCSS vs CSS vars",
        ],
        "id": 56,
    },
    {
        "startTime": 1721467800000,
        "endTime": 1721475000000,
        "descriptions": [
            "Explore Turbopack and figure out that it doesn’t support bundling for Vue right now",
            "Write ticket for R&D: https://policymap.atlassian.net/browse/PR-2061",
        ],
        "id": 57,
    },
    {
        "startTime": 1721659500000,
        "endTime": 1721665800000,
        "descriptions": ["Talk with Daniel about the SSO setup and how the flow works"],
        "id": 58,
    },
    {
        "startTime": 1721699400000,
        "endTime": 1721713800000,
        "descriptions": [
            "Set up Control Panel with proper credentials in the SSO testing branch",
            "Get acquainted with the Control Panel (sessions)",
            "Tail logs in services container to look for possible errors after SSO change",
        ],
        "id": 59,
    },
    {
        "startTime": 1721748000000,
        "endTime": 1721749800000,
        "descriptions": [
            "Talk with Daniel about the next tasks",
            "Test latest login flow",
            "Figure out that +sub accounts exist",
        ],
        "id": 60,
    },
    {
        "startTime": 1721791500000,
        "endTime": 1721797800000,
        "descriptions": [
            "Talk with Daniel, learn about SSO flow in more detail",
            "R&D SSO",
        ],
        "id": 61,
    },
    {
        "startTime": 1721817900000,
        "endTime": 1721828700000,
        "descriptions": [
            "R&D more SSO",
            "Test my @policymap user and +sub@policymap user to dev setup",
        ],
        "id": 62,
    },
    {
        "startTime": 1721864400000,
        "endTime": 1721883900000,
        "descriptions": [
            "Talk with Daniel & Kevin about IP restrictions for enterprise license",
            "Learn & Test IP restrictions in the new SSO branch",
            "Find out that IP restrictions isn't enforced right now",
        ],
        "id": 63,
    },
    {
        "startTime": 1721968800000,
        "endTime": 1721973600000,
        "descriptions": [
            "Test PolicyMap provider (sp: ndapa) and (sp: www), find out that www is not working properly",
            "Test IP restrictions, and figure out something still doesn't work properly",
        ],
        "id": 64,
    },
    {
        "startTime": 1722015000000,
        "endTime": 1722020400000,
        "descriptions": [
            "Confirm that the fix Helene did fixed the issue i found",
            "Did another round of testing",
        ],
        "id": 65,
    },
    {
        "startTime": 1722103200000,
        "endTime": 1722108600000,
        "descriptions": [
            "Do continuous testing on latest website",
            "Start R&D on large build chunk size",
        ],
        "id": 66,
    },
    {
        "startTime": 1722137700000,
        "endTime": 1722140400000,
        "descriptions": ["R&D on the manualChunks option in Vite"],
        "id": 67,
    },
    {
        "startTime": 1722164340000,
        "endTime": 1722185940000,
        "descriptions": [
            "Do R&D on manualChunks",
            "Create ticket for this: https://policymap.atlassian.net/browse/PR-2078",
            "Finish R&D and write conclusions in the ticket",
        ],
        "id": 68,
    },
    {
        "startTime": 1722189600000,
        "endTime": 1722196800000,
        "descriptions": [
            "Create PR: https://bitbucket.org/policymap/website/pipelines/results/12125",
            "Talk about the R&D i did with Daniel, discuss next steps",
        ],
        "id": 69,
    },
    {
        "startTime": 1722231600000,
        "endTime": 1722251400000,
        "descriptions": [
            "Play around with `node_tasks`",
            "Do benchmarks to evaluate whether the changes are good for the app",
            "Leave comments on ticket",
        ],
        "id": 70,
    },
    {
        "startTime": 1722272400000,
        "endTime": 1722274200000,
        "descriptions": [
            "Talk to Daniel about next tasks",
            "Set up bitbucket & atlassian for @policymap email",
        ],
        "id": 71,
    },
    {
        "startTime": 1722318300000,
        "endTime": 1722321900000,
        "descriptions": ["Did continuous SSO testing"],
        "id": 72,
    },
    {
        "startTime": 1722358800000,
        "endTime": 1722380400000,
        "descriptions": [
            "Update node version in test repo Dockerfile",
            "Create PR: https://bitbucket.org/policymap/test/pull-requests/13/overview",
            "Create ticket: https://policymap.atlassian.net/browse/PR-2080",
            "Do stuff with test repo",
        ],
        "id": 73,
    },
    {
        "startTime": 1722411900000,
        "endTime": 1722426300000,
        "descriptions": [
            "Find out why chrome installation didn't work before",
            "Try and integrate new tests",
            "R&D on what changed in the new versions of jest, puppeteer, etc",
        ],
        "id": 74,
    },
    {
        "startTime": 1722431640000,
        "endTime": 1722445140000,
        "descriptions": [
            "Talk to Daniel about the work I did in the test repo",
            "Create a PR to allow S3 in dev shell: https://bitbucket.org/policymap/org/pull-requests/113",
            "Talk about testing locally in shell",
        ],
        "id": 75,
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
