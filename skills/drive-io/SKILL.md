# Skill: drive.io Cloud Bridge
Manage your cloud clipboard and file transfers. 

> [!NOTE]
> This skill is fully compatible with the Model Context Protocol (MCP). You can connect this to platforms like Cursor, Windsurf, or Manus using the SSE endpoint: `https://drive.io/api/mcp`

## Authentication (API Keys)
**Authentication is mandatory for all agent-facing tools.** To use Drive.io, you must provide a valid API Key (`sk_abc123`) generated from the user dashboard. 

- **Requirement:** If unauthenticated, requests will fail with a message: *"Please tell the user to create an account at https://drive.io/dashboard to get an API key."* You should present this message clearly to the user.
- **Generate a Key:** The human user must navigate to `https://drive.io/dashboard` to generate an API Key.
- **Standard Configuration:** Set the environment variable `DRIVEIO_API_KEY` in your runtime environment.
- **Direct Usage:** Send this key in the header of every request: `Authorization: Bearer <your_api_key>`

### Example Setup (Python)
```python
import os
# The Drive.io SDK/Client will look for this variable
os.environ["DRIVEIO_API_KEY"] = "sk_abc123"
```

## Zero-Knowledge Privacy Protocol (Recommended)
**For maximum privacy, agents should encrypt artifacts before they leave the local environment.** Drive.io technically supports "Zero-Knowledge" storage where the server only ever see ciphertext and holds no decryption keys.

### 1. The Strategy
- **Encryption**: Encrypt your payload using `AES-256-GCM`.
- **Key Passing**: Append the decryption key to the returned URL as a **Fragment Overlay** (e.g., `https://drive.io/id#key=<hex_key>`). 
- **Security**: URL fragments are never sent to the server, ensuring Drive.io remains architecturally blind to your data.

### 2. Implementation Logic (Python Example)
```python
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# 1. Generate a random 32-byte key
key = AESGCM.generate_key(bit_length=256)
aesgcm = AESGCM(key)
nonce = os.urandom(12)

# 2. Encrypt your data
data = "Sensitive agent thoughts...".encode()
ciphertext = aesgcm.encrypt(nonce, data, None)

# 3. Upload the ciphertext + nonce as the 'content'
# 4. Format the final URL: https://drive.io/<id>#key=<key.hex()>:<nonce.hex()>
```

---

## System Limits
To ensure reliable operation, please respect the following constraints:
- **Rate Limits:** There are currently no hard rate limits defined in the API, but aggressive polling or intentional abuse will result in IP bans.
- **File/Data Size Limits:** Uploads (files and clips) are strictly limited to **100MB** per request.
- **TTL (Time To Live):** By default, all assets (clips and files) are ephemeral and automatically deleted after **24 hours** (2,592,000 seconds for clips in Redis). If `burnAfterReading` is set to `true`, the asset is deleted immediately after the first successful `GET` request.

## Tools

### create_clip
- **Description:** Sends text, code snippets, or logs to the cloud. **Recommended: Encrypt content locally before sending for Zero-Knowledge privacy.**
- **Parameters:**
  - `content`: (string) The text to save.
  - `title`: (string) Optional name for the clip.
  - `isPrivate`: (boolean) Whether the clip should be private.
  - `burnAfterReading`: (boolean) If true, the clip is deleted after 1 view. Default: false.
- **Returns:** A drive.io URL and an ID.
- **API Call:**
  - `POST /api/v1/clips`
  - Body: `{ "content": "...", "title": "...", "isPrivate": true, "burnAfterReading": false }`

### retrieve_clip (Programmatic Data Retrieval)
- **Description:** Fetches data back from Drive.io using the `id` returned from `create_clip` or file uploads.
- **Parameters:**
  - `id`: (string) The unique identifier of the clip/file.
  - `download`: (boolean, optional) If `true`, bypasses the JSON wrapper and returns the raw file/text stream directly.
- **Returns:** By default, a JSON object containing a presigned download URL. If `?download=true` is used, returns the raw data payload directly. Note: If `burnAfterReading` was true, this will consume the clip.
- **API Call:**
  - `GET /api/file/<id>` (Returns JSON metadata)
  - `GET /api/file/<id>?download=true` (Returns raw file/text directly)

### upload_file_stream
- **Description:** Uploads a file to the cloud. Max size: 100MB. **Note: Encrypt file locally first for Zero-Knowledge privacy.**
- **Parameters:**
  - `filePath`: (string) Local path to the file.
  - `contentType`: (string) MIME type of the file.
- **Returns:** A drive.io URL.
- **API Call:**
  - `POST /api/upload` (to get presigned URL)
  - `PUT <presigned_url>` (with file content)

### park_handoff
- **Description:** Parks context or data for another agent to pick up asynchronously.
- **Parameters:**
  - `payload`: (string | object) The data to pass.
  - `targetAgentId`: (string) The ID of the agent receiving this handoff.
  - `ttlSeconds`: (number) Optional. How long the payload lives before expiring. Default 3600.
- **Returns:** A `handoff_id` and `PENDING` status.
- **API Call:**
  - `POST /api/v1/handoff`
  - Body: `{ "payload": "...", "targetAgentId": "...", "ttlSeconds": 3600 }`
  - **Note:** This endpoint currently requires specific authentication headers.

### poll_handoff
- **Description:** Checks if a handoff parked by another agent is ready to be consumed. Reading it automatically initiates the auto-burn sequence.
- **Parameters:**
  - `id`: (string) The `handoff_id` returned from `park_handoff`.
- **Returns:** The payload data and marks it as `CONSUMED`.
- **API Call:**
  - `GET /api/v1/handoff?id=<handoff_id>`

---

## Graph & Knowledge Management Tools (New)

### create_link
- **Description:** Establishes a relationship between two existing clips or files.
- **Parameters:**
  - `sourceId`: (string) The ID of the primary artifact.
  - `targetId`: (string) The ID of the related artifact.
  - `relation`: (string) The type of relationship (e.g., `implements`, `tests`, `documents`, `illustrates`, `relates_to`).
- **Returns:** A confirmation object with a `link_id`.

### index_structural_graph
- **Description:** Scans a code repository to map its architecture (imports, exports, calls).
- **Parameters:**
  - `repoPath`: (string) The local path to the repository.
- **Returns:** A `graph_id` pointing to a Graph Descriptor in Drive.io.

### index_semantic_folder
- **Description:** Scans a generic folder (documents, images, etc.) to build a semantic map based on hierarchy and proximity.
- **Parameters:**
  - `folderPath`: (string) The local path to the folder.
- **Returns:** A `graph_id` pointing to a Semantic Map in Drive.io.

### retrieve_neighborhood
- **Description:** Fetches a "knowledge cluster" centered around a specific clip.
- **Parameters:**
  - `id`: (string) The ID of the starting clip.
  - `depth`: (number, optional) How many degrees of relationship to traverse. Default: 1.
- **Returns:** A list of related clips and their relationship types.
