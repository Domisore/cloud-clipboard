# Skill: drive.io Cloud Bridge
Manage your cloud clipboard and file transfers. 

> [!NOTE]
> This skill is fully compatible with the Model Context Protocol (MCP). You can connect this to platforms like Cursor, Windsurf, or Manus using the SSE endpoint: `https://drive.io/api/mcp`
> 
> * **If using MCP:** The native tools exposed to your environment (`upload_artifact` and `fetch_artifact`) are currently **mock simulations** for demonstration. They do not store real data or affect dashboard hits. To store files/clips persistently, use the raw HTTP cURL endpoints below.
> * **If NOT using MCP (HTTP cURL):** The tools below are standard HTTP endpoints. You **cannot** call them as native functions (e.g. `create_clip(...)`). You must write code (e.g., Python `requests` or shell `curl`) to execute these calls using your local code execution environment.

### Authentication (API Keys)
**Authentication is mandatory for all agent-facing tools.** To use Drive.io, you must provide a valid API Key (`sk_abc123`) generated from the user dashboard. 

- **Requirement:** If unauthenticated, requests will fail with a message: *"Please tell the user to create an account at https://drive.io/dashboard to get an API key."* You should present this message clearly to the user.
- **Generate a Key:** The human user must navigate to `https://drive.io/dashboard` (or `http://localhost:3000/dashboard` in development) to generate an API Key.
- **Direct Usage:** Provide this key in the `Authorization: Bearer <your_api_key>` header of every API call. Replace `<your_api_key_or_env_var>` with your actual key string (e.g. `dr_live_abc123...`) if you cannot set environment variables.

## Base URLs
Configure the correct Base URL depending on your runtime environment:
- **Local Development:** `http://localhost:3000`
- **Production Deployment:** `https://drive.io`

*Note: The curl commands below default to the production URL `https://drive.io`. If you are developing locally, you can replace `https://drive.io` with `http://localhost:3000`.*

## Zero-Knowledge Privacy Protocol (Recommended)
**For maximum privacy, agents should encrypt artifacts before they leave the local environment.** Drive.io technically supports "Zero-Knowledge" storage where the server only ever sees ciphertext.

1. **Encrypt**: Use `AES-256-GCM` to encrypt your payload.
2. **Key Transfer**: Append the key/nonce to the URL as a **fragment**: `https://drive.io/id#key=<hex_key>`.
3. **Privacy**: Fragments are never sent to our servers. We stay architecturally blind.

### Example Setup (Python)
```python
import os
# The Drive.io SDK/Client will look for this variable
os.environ["DRIVEIO_API_KEY"] = "sk_abc123"
```

## System Limits
To ensure reliable operation, please respect the following constraints:
- **Rate Limits:** There are currently no hard rate limits defined in the API, but aggressive polling or intentional abuse will result in IP bans.
- **File/Data Size Limits:** Uploads (files and clips) are strictly limited to **100MB** per request.
- **TTL (Time To Live):** By default, all assets (clips and files) are ephemeral and automatically deleted after **24 hours**. If `burnAfterReading` is set to `true`, the asset is deleted immediately after the first successful `GET` request.

## Tools

### retrieve_clip
- **Description:** Fetches data back from Drive.io using the `id` returned from `create_clip` or file uploads.
- **Parameters:**
  - `id`: (string) The unique identifier of the clip/file.
  - `download`: (boolean, optional) If `true`, returns the raw content stream directly instead of JSON.
- **Returns:** JSON metadata or raw content.
- **API Call & curl Examples:**
  - **Endpoint:** `GET https://drive.io/api/file/<id>`
  - **curl Command:**
    ```bash
    curl -H "Authorization: Bearer <your_api_key_or_env_var>" "https://drive.io/api/file/<id>"
    ```

### create_clip
- **Description:** Sends text, code snippets, or logs to the cloud clipboard.
- **Parameters:**
  - `content`: (string) The text to save.
  - `title`: (string, optional) Name for the clip.
  - `isPrivate`: (boolean, optional) Whether the clip should be private.
  - `burnAfterReading`: (boolean, optional) If true, the clip is deleted after 1 view.
- **Returns:** A drive.io URL and an ID.
- **API Call & curl Examples:**
  - **Endpoint:** `POST https://drive.io/api/v1/clips`
  - **curl Command:**
    ```bash
    curl -X POST "https://drive.io/api/v1/clips" \
      -H "Authorization: Bearer <your_api_key_or_env_var>" \
      -H "Content-Type: application/json" \
      -d '{"content": "Your content here", "title": "Clip Title", "isPrivate": true, "burnAfterReading": false}'
    ```

### upload_file_stream
- **Description:** Uploads a file to the cloud. Max size: 100MB.
- **Parameters:**
  - `filePath`: (string) Local path to the file.
  - `contentType`: (string) MIME type of the file.
  - `size`: (number) The size of the file in bytes (e.g. `1024`).
- **Returns:** A drive.io URL.
- **API Call & curl Examples:**
  - **Step 1: Get presigned URL** (`POST https://drive.io/api/upload`)
    
    **Request Body JSON Structure:**
    ```json
    {
      "filename": "string",
      "contentType": "string",
      "size": number
    }
    ```

    **Response JSON Structure (HTTP 200):**
    ```json
    {
      "url": "https://...",
      "id": "string",
      "key": "string"
    }
    ```
    
    > [!IMPORTANT]
    > You **must** provide the JSON body with exactly `filename` (string), `contentType` (string), and `size` (number of bytes). If the request body is empty, missing, or any field is omitted, it will return an `"Unexpected end of JSON input"` or `"Missing required fields"` error.
    
    ```bash
    curl -X POST "https://drive.io/api/upload" \
      -H "Authorization: Bearer <your_api_key_or_env_var>" \
      -H "Content-Type: application/json" \
      -d '{"filename": "test.txt", "contentType": "text/plain", "size": 1024}'
    ```
  - **Step 2: Upload raw file content** (`PUT <presigned_url>`)
    ```bash
    curl -X PUT "<presigned_url_returned_from_step_1>" \
      -H "Content-Type: text/plain" \
      --upload-file /path/to/local/file
    ```
  - **Step 3: Register and Finalize Upload** (`POST https://drive.io/api/complete`)
    
    After successfully uploading the file to the presigned URL, you **must** call this endpoint to finalize the upload in the database. Failing to run this step means the file will not be indexed in Redis and will not show up in the user's dashboard.

    **Request Body JSON Structure:**
    ```json
    {
      "id": "string",
      "key": "string",
      "filename": "string",
      "size": number,
      "contentType": "string",
      "burnAfterReading": boolean
    }
    ```

    **Response JSON Structure (HTTP 200):**
    ```json
    {
      "success": true,
      "id": "string",
      "url": "https://drive.io/c/id",
      "tiers": ["L0", "L1", "L2"]
    }
    ```

    ```bash
    curl -X POST "https://drive.io/api/complete" \
      -H "Authorization: Bearer <your_api_key_or_env_var>" \
      -H "Content-Type: application/json" \
      -d '{"id": "abcXYZ", "key": "abcXYZ-test.txt", "filename": "test.txt", "size": 1024, "contentType": "text/plain", "burnAfterReading": false}'
    ```

### park_handoff
- **Description:** Parks context or data for another agent to pick up asynchronously.
- **Parameters:**
  - `payload`: (string | object) The data to pass.
  - `targetAgentId`: (string) The ID of the agent receiving this handoff.
  - `ttlSeconds`: (number, optional) Expiry in seconds. Default 3600.
- **Returns:** A `handoff_id` and `PENDING` status.
- **API Call & curl Examples:**
  - **Endpoint:** `POST https://drive.io/api/v1/handoff`
  - **curl Command:**
    ```bash
    curl -X POST "https://drive.io/api/v1/handoff" \
      -H "Authorization: Bearer <your_api_key_or_env_var>" \
      -H "Content-Type: application/json" \
      -d '{"payload": "Handoff payload content", "targetAgentId": "agent_abc", "ttlSeconds": 3600}'
    ```

### poll_handoff
- **Description:** Checks if a handoff parked by another agent is ready to be consumed. Reading it automatically initiates the auto-burn sequence.
- **Parameters:**
  - `id`: (string) The `handoff_id` returned from `park_handoff`.
- **Returns:** The payload data and marks it as `CONSUMED`.
- **API Call & curl Examples:**
  - **Endpoint:** `GET https://drive.io/api/v1/handoff?id=<handoff_id>`
  - **curl Command:**
    ```bash
    curl -H "Authorization: Bearer <your_api_key_or_env_var>" "https://drive.io/api/v1/handoff?id=<handoff_id>"
    ```

---

## Graphify Workspace Tools

### publish_workspace_graph
- **Description:** Publishes a locally-compiled workspace graph JSON file to drive.io's active cloud storage database, updating the visual canvas, version history ledger, and chatbot registry.
- **Parameters:**
  - `graphFile`: (string) Absolute path to the local compiled `graph.json` file on the filesystem.
- **Returns:** JSON object confirming successful ingestion and version assignment.
- **Expected JSON Structure for `graph.json`:**
  ```json
  {
    "namespace": "acme-campaign",
    "nodes": [
      {
        "id": "src/marketing-schedule.xlsx",
        "label": "Document",
        "properties": {
          "description": "Campaign timelines and schedules",
          "group": "marketing"
        }
      },
      {
        "id": "src/assets/logo.png",
        "label": "Asset",
        "properties": {
          "description": "Vector brand logo file",
          "group": "assets"
        }
      }
    ],
    "edges": [
      {
        "source": "src/marketing-schedule.xlsx",
        "target": "src/assets/logo.png",
        "annotations": ["#approved"]
      }
    ]
  }
  ```
- **API Call & curl Examples:**
  - **Endpoint:** `POST https://drive.io/api/graphify/ingest`
  - **curl Command:**
    ```bash
    curl -X POST "https://drive.io/api/graphify/ingest" \
      -H "Authorization: Bearer <your_api_key_or_env_var>" \
      -H "Content-Type: application/json" \
      -d @/path/to/local/graph.json
    ```

### query_workspace_node
- **Description:** Performs a local graph traversal from a starting file (node) up to a specific depth limit, returning adjacent linked files, annotations, and connection records.
- **Parameters:**
  - `namespace`: (string) The workspace name (e.g. `acme-campaign`).
  - `id`: (string) The file path node key to start traversing from (e.g. `src/marketing-schedule.xlsx`).
  - `depth`: (number, optional) The maximum search depth hops (default: 1).
- **Returns:** JSON containing adjacent nodes, edges, and annotations.
- **API Call & curl Examples:**
  - **Endpoint:** `GET https://drive.io/api/graphify/node?namespace=<namespace>&id=<node_id>&depth=<depth>`
  - **curl Command:**
    ```bash
    curl -H "Authorization: Bearer <your_api_key_or_env_var>" \
      "https://drive.io/api/graphify/node?namespace=acme-campaign&id=src/marketing-schedule.xlsx&depth=1"
    ```

### search_workspace_relations
- **Description:** Runs a text search query across all file path IDs, labels, descriptions, and annotation values inside the workspace to locate related nodes.
- **Parameters:**
  - `namespace`: (string) The workspace name.
  - `q`: (string) The search keyword or phrase.
- **Returns:** List of matching nodes sorted by relevance.
- **API Call & curl Examples:**
  - **Endpoint:** `GET https://drive.io/api/graphify/query?namespace=<namespace>&q=<query>`
  - **curl Command:**
    ```bash
    curl -H "Authorization: Bearer <your_api_key_or_env_var>" \
      "https://drive.io/api/graphify/query?namespace=acme-campaign&q=logo"
    ```

### get_latest_workspace_summary
- **Description:** Gets a summary of the latest compiled workspace graph. Allows tier-based context reduction to optimize token bills on your LLM models.
- **Parameters:**
  - `namespace`: (string) The workspace name.
  - `tier`: (string, optional) Optimization level:
    - `L0`: Super compact metadata overview (counts only) for token routing.
    - `L1`: Core file relations (removes secondary asset leaves).
    - `L2`: Entire raw JSON graph.
  - `version`: (string, optional) Retrieve a specific version (e.g. `v3`) instead of latest active graph.
- **Returns:** The filtered graph structure.
- **API Call & curl Examples:**
  - **Endpoint:** `GET https://drive.io/api/graphify/latest?namespace=<namespace>&tier=<tier>`
  - **curl Command:**
    ```bash
    curl -H "Authorization: Bearer <your_api_key_or_env_var>" \
      "https://drive.io/api/graphify/latest?namespace=acme-campaign&tier=L1"
    ```
