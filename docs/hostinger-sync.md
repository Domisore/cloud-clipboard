# Hostinger Automated File Sync Guide

This document guides you on how to automate the sync of files and Graphify workspace graphs from your Hostinger LLM Wiki hosting environment to your `drive.io` cloud storage.

---

## Option A: Cron + cURL Ingest Script (Best for `graph.json` layout updates)
If you only need to automatically push the compiled codebase graph layout database whenever the wiki updates, you can place a lightweight shell script on your Hostinger server and trigger it via a cron job.

### 1. Create the Script
Create a script named `sync_graph.sh` in your Hostinger account directory:

```bash
#!/bin/bash

# Configuration
GRAPH_FILE="/path/to/llm-wiki/docs/graph.json"
STATUS_FILE="/path/to/llm-wiki/docs/.last_sync_timestamp"
API_KEY="sk_live_your_api_key_here"  # Get this from https://drive.io/dashboard
NAMESPACE="default-org"

# Check if graph.json has been modified since the last sync
if [ "$GRAPH_FILE" -nt "$STATUS_FILE" ]; then
  echo "New graph compilation detected. Ingesting to drive.io..."
  
  curl -X POST "https://drive.io/api/graphify/ingest?namespace=${NAMESPACE}" \
    -H "Authorization: Bearer ${API_KEY}" \
    -H "Content-Type: application/json" \
    -d @"${GRAPH_FILE}"
    
  # Update status timestamp to prevent double ingestion
  touch "$STATUS_FILE"
fi
```

### 2. Set Execute Permissions
Make the script executable:
```bash
chmod +x /path/to/sync_graph.sh
```

### 3. Schedule the Cron Job on Hostinger
Navigate to the Cron Jobs panel in your Hostinger hPanel and schedule the script to run every 5 minutes:
```cron
*/5 * * * * /bin/bash /path/to/sync_graph.sh >/dev/null 2>&1
```

---

## Option B: Rclone WebDAV Sync (Best for general file/directory sweeps)
If you want to sync **actual wiki pages, media assets, or code documentation files** from your Hostinger directory so they are indexed in your `drive.io` dashboard registry, you can mount `drive.io` as a WebDAV storage provider.

### 1. Configure Rclone
Create or edit the Rclone configuration file at `~/.config/rclone/rclone.conf` on your Hostinger server:

```ini
[drive-io]
type = webdav
url = https://drive.io/webdav/
vendor = other
user = sk_live_your_api_key_here
pass = sk_live_your_api_key_here
```
*(Note: The WebDAV endpoint accepts your active API Key directly as the username and password).*

### 2. Schedule the Folder Sync
Create a cron job on Hostinger to run the sync command hourly. This will sync the contents of Hostinger's local directory into the `default-org` namespace folder on `drive.io`:

```cron
0 * * * * rclone sync /path/to/llm-wiki/files/ drive-io:default-org/wiki/ --quiet
```
*Note: Any files pushed this way will automatically populate on your web dashboard under the `default-org` workspace and remain accessible programmatically.*

---

## Managing Multiple Wikis via Namespaces

`drive.io` uses **namespaces** to partition files, graph structures, and histories. Namespaces act as virtual root-level folders (or workspaces) under your account.

If you have multiple wikis (e.g., `wiki-a` and `wiki-b`), you can manage them concurrently by assigning them different namespace tags:

### 1. Ingesting Separate Graphs
Adjust your sync script (`sync_graph.sh`) to specify the corresponding namespace for each repository:
* For Wiki A: `NAMESPACE="wiki-a"`
* For Wiki B: `NAMESPACE="wiki-b"`

The dashboard UI will automatically detect all active namespaces and display them in the top-left dropdown selector, allowing you to toggle between graphs seamlessly.

### 2. Syncing General Files via Rclone
WebDAV paths automatically map namespaces as directories (`/webdav/<namespace>/`). You can configure a single Rclone remote and sync separate local folders to distinct virtual folders:
* Sync Wiki A: `rclone sync /path/to/wiki-A/ drive-io:wiki-a/`
* Sync Wiki B: `rclone sync /path/to/wiki-B/ drive-io:wiki-b/`

