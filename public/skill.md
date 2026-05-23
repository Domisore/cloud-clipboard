# Skill: drive.io Cloud Bridge
Manage your cloud clipboard and file transfers. 

> [!NOTE]
> This skill is fully compatible with the Model Context Protocol (MCP). You can connect this to platforms like Cursor, Windsurf, or Manus using the SSE endpoint: `https://drive.io/api/mcp`
> 
> * **If using MCP:** The native tools exposed to your environment are `upload_artifact` (for uploading clips/files) and `fetch_artifact` (for retrieving files).
> * **If NOT using MCP:** The tools below are standard HTTP endpoints. You **cannot** call them as native functions (e.g. `create_clip(...)`). You must write code (e.g., Python `requests` or shell `curl`) to execute these calls using your local code execution environment.

### Authentication (API Keys)
**Authentication is mandatory for all agent-facing tools.** To use Drive.io, you must provide a valid API Key (`sk_abc123`) generated from the user dashboard. 

- **Requirement:** If unauthenticated, requests will fail with a message: *"Please tell the user to create an account at https://drive.io/dashboard to get an API key."* You should present this message clearly to the user.
- **Generate a Key:** The human user must navigate to `https://drive.io/dashboard` (or `http://localhost:3000/dashboard` in development) to generate an API Key.
- **Direct Usage:** Provide this key in the `Authorization: Bearer <your_api_key>` header of every API call. Replace `<your_api_key_or_env_var>` with your actual key string (e.g. `dr_live_abc123...`) if you cannot set environment variables.

## Base URLs
Configure the correct Base URL depending on your runtime environment:
- **Local Development:** `http://localhost:3000`
- **Production Deployment:** `https://drive.io`

*Note: In the curl commands below, replace `<BaseURL>` with either `http://localhost:3000` or `https://drive.io` depending on your setup.*

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
  - **Endpoint:** `GET <BaseURL>/api/file/<id>`
  - **curl Command:**
    ```bash
    curl -H "Authorization: Bearer <your_api_key_or_env_var>" "<BaseURL>/api/file/<id>"
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
  - **Endpoint:** `POST <BaseURL>/api/v1/clips`
  - **curl Command:**
    ```bash
    curl -X POST "<BaseURL>/api/v1/clips" \
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
  - **Step 1: Get presigned URL** (`POST <BaseURL>/api/upload`)
    > [!IMPORTANT]
    > You **must** provide the JSON body with `filename` (string), `contentType` (string), and `size` (number of bytes). If the request body is empty or missing `size`, it will return an `"Unexpected end of JSON input"` or `"Missing required fields"` error.
    ```bash
    curl -X POST "<BaseURL>/api/upload" \
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

### park_handoff
- **Description:** Parks context or data for another agent to pick up asynchronously.
- **Parameters:**
  - `payload`: (string | object) The data to pass.
  - `targetAgentId`: (string) The ID of the agent receiving this handoff.
  - `ttlSeconds`: (number, optional) Expiry in seconds. Default 3600.
- **Returns:** A `handoff_id` and `PENDING` status.
- **API Call & curl Examples:**
  - **Endpoint:** `POST <BaseURL>/api/v1/handoff`
  - **curl Command:**
    ```bash
    curl -X POST "<BaseURL>/api/v1/handoff" \
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
  - **Endpoint:** `GET <BaseURL>/api/v1/handoff?id=<handoff_id>`
  - **curl Command:**
    ```bash
    curl -H "Authorization: Bearer <your_api_key_or_env_var>" "<BaseURL>/api/v1/handoff?id=<handoff_id>"
    ```
