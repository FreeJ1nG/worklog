This directory stores any ephemeral/persistent data (mostly) in JSON format

The directory look empty since these files aren't pushed onto Github

It should contain two files:
- `logs.json`, should contain an array of logs, each log entry will contain the following fields
    - `startTime` in unix (milliseconds)
    - `endTime` in unix (milliseconds)
    - `descriptions`, an array of string consisting of the description(s) of the log
    - `id`, an autogenerated integer field (should be distinct)
- `sessions.json` should contain an array of strings of allowed session ids, something like `["asdf", "hehe", "lol"]`
