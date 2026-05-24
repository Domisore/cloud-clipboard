# Graphify × drive.io Integration
## Detailed Implementation Plan

**Status:** Pre-build planning document
**Version:** 1.0 — May 2026
**Scope:** Cloud storage ↔ filesystem bridge, Graphify API surface, human dashboard, agent query layer

---

## Overview

This document covers the full integration of Graphify's knowledge graph construction pipeline with drive.io's cloud artifact storage layer. The goal is a bidirectional system where:

- Graphify can traverse and process data that lives in drive.io as if it were a local filesystem
- drive.io stores, versions, and serves the resulting graph structures as first-class artifacts
- Agents can query, traverse, and reason over graph data via drive.io's existing pointer + tiered retrieval model
- Human users can browse, visualize, and manage graphified data structures from the drive.io dashboard

The integration is organized into four implementation phases, followed by the API surface specification and dashboard requirements.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│   Human Dashboard (graph viz, search, manage)                   │
│   Agent SDK (query, traverse, annotate)                         │
│   Graphify CLI (ingest, build, export)                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    DRIVE.IO API LAYER                            │
│   /api/graphify/*   — graph-specific endpoints                  │
│   /api/upload       — existing artifact relay (unchanged)       │
│   /api/fetch        — existing tiered retrieval (unchanged)     │
│   WebDAV adapter    — filesystem bridge for Graphify process    │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                   STORAGE LAYER                                  │
│   Raw source artifacts   — existing drive.io artifact store     │
│   Graph objects (nodes)  — drive://graph/{namespace}/{id}       │
│   Graph edges            — drive://graph/{namespace}/edges      │
│   graph.json             — full serialized graph per namespace  │
│   L0/L1/L2 graph tiers   — auto-generated on ingest            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1 — The Filesystem Bridge (WebDAV Adapter)

This is the foundation everything else depends on. Graphify expects to traverse a local directory. The bridge makes drive.io look like a local filesystem to Graphify without modifying Graphify's code.

### Why WebDAV over FUSE

FUSE requires kernel-level permissions, has no Windows support, and `fusepy` is essentially unmaintained. WebDAV + rclone is a one-liner that developers already trust, works across all OS environments, and maps cleanly onto drive.io's existing REST surface.

### 1.1 WebDAV Endpoint Implementation

Add a WebDAV protocol adapter to drive.io's server. This is a thin translation layer over the existing artifact storage — not new storage logic.

**Required WebDAV methods to implement:**

| Method | Maps to drive.io operation | Notes |
|---|---|---|
| `PROPFIND` | List artifacts in a namespace | Returns file metadata: name, size, content-type, modified date |
| `GET` | `GET /api/fetch?id={hash}` | Streams artifact content |
| `PUT` | `POST /api/upload` | Uploads artifact, returns drive.io hash URL |
| `DELETE` | `DELETE /api/artifact/{id}` | Soft delete — marks as inactive, retains for audit |
| `MKCOL` | Create namespace | Maps to drive.io namespace creation |
| `MOVE` | Rename / move artifact | Update metadata only — content hash unchanged |

**Endpoint base path:**
```
https://drive.io/webdav/{namespace}/
```

**Authentication:**
```
Authorization: Bearer {api_key}
```
Standard HTTP Basic Auth header as a fallback for rclone compatibility.

**PROPFIND response structure** (XML, WebDAV spec):
```xml
<D:multistatus>
  <D:response>
    <D:href>/webdav/acme/report-q3.csv</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>report-q3.csv</D:displayname>
        <D:getcontentlength>102400</D:getcontentlength>
        <D:getcontenttype>text/csv</D:getcontenttype>
        <D:getlastmodified>Mon, 12 May 2026 14:30:00 GMT</D:getlastmodified>
        <!-- drive.io extension properties -->
        <driveio:hash>N37X6P9R2Z</driveio:hash>
        <driveio:pointer>https://drive.io/c/N37X6P9R2Z</driveio:pointer>
      </D:prop>
    </D:propstat>
  </D:response>
</D:multistatus>
```

### 1.2 rclone Configuration

Provide a first-class rclone remote config that clients can add with a single command:

```bash
rclone config create driveio webdav \
  url=https://drive.io/webdav/your-namespace \
  vendor=other \
  user=api \
  pass=$(rclone obscure your-api-key)
```

Mount and point Graphify at it:
```bash
rclone mount driveio: ~/driveio-vault/ --daemon
graphify ~/driveio-vault/
```

### 1.3 Native Python/Node Client Mount (Optional, v1.1)

For environments where rclone isn't available (CI/CD, sandboxed agents), provide a lightweight Python mount helper in the drive.io SDK:

```python
from driveio import mount

# Mounts drive.io namespace as a local path context manager
with mount("acme-namespace", api_key=os.environ["DRIVEIO_KEY"]) as path:
    result = graphify.run(path)
```

Under the hood this uses `requests` to proxy filesystem calls — no FUSE required.

---

## Phase 2 — Graphify Ingest Pipeline

Once Graphify can read from drive.io via the filesystem bridge, we need to capture its output (the constructed knowledge graph) back into drive.io as a structured, queryable artifact.

### 2.1 Graph Storage Schema

A Graphify output (`graph.json`) is stored in drive.io as a special artifact type with structured metadata.

**drive.io artifact types added:**

| Type | MIME | Description |
|---|---|---|
| `graph/json` | `application/vnd.driveio.graph+json` | Full serialized graph |
| `graph/node` | `application/vnd.driveio.graph.node+json` | Individual node |
| `graph/edges` | `application/vnd.driveio.graph.edges+json` | Edge index |
| `graph/summary` | `application/vnd.driveio.graph.summary+json` | L0/L1 auto-summary |

**graph.json schema stored in drive.io:**
```json
{
  "schema_version": "1.0",
  "namespace": "acme",
  "created_at": "2026-05-12T14:30:00Z",
  "source_artifacts": [
    "https://drive.io/c/N37X6P9R2Z",
    "https://drive.io/c/K82M4P1X9A"
  ],
  "nodes": [
    {
      "id": "node_001",
      "label": "Q3 Revenue Report",
      "type": "document",
      "properties": {
        "created": "2026-04-01",
        "author": "finance-agent",
        "summary": "Quarterly revenue analysis showing 12% YoY growth"
      },
      "pointer": "https://drive.io/c/N37X6P9R2Z",
      "tiers": {
        "L0": "Q3 revenue report, 458 rows, 12% YoY growth",
        "L1": "Quarterly revenue analysis for Acme Corp covering Q3 2026...",
        "L2": "https://drive.io/c/N37X6P9R2Z?tier=L2"
      }
    }
  ],
  "edges": [
    {
      "id": "edge_001",
      "source": "node_001",
      "target": "node_002",
      "relationship": "references",
      "weight": 0.87
    }
  ],
  "metadata": {
    "node_count": 142,
    "edge_count": 389,
    "depth": 4,
    "graphify_version": "0.x.x"
  }
}
```

### 2.2 Ingest API Endpoint

```
POST https://drive.io/api/graphify/ingest
```

**Request body:**
```json
{
  "namespace": "acme",
  "source": "drive://resources/acme/",
  "graphify_config": {
    "depth": 3,
    "include_types": ["markdown", "json", "csv", "pdf"],
    "exclude_patterns": ["*.tmp", "draft-*"]
  },
  "options": {
    "auto_generate_tiers": true,
    "store_nodes_individually": true,
    "webhook_on_complete": "https://your-app.com/webhooks/graph-ready"
  }
}
```

**Response (async job):**
```json
{
  "job_id": "job_8f2k9x",
  "status": "queued",
  "estimated_duration_seconds": 45,
  "poll_url": "https://drive.io/api/graphify/jobs/job_8f2k9x",
  "graph_pointer": "https://drive.io/g/acme/latest"
}
```

### 2.3 Ingest Job Lifecycle

```
queued → processing → indexing → tier_generation → complete
                   ↘ failed (with error detail)
```

**Poll endpoint:**
```
GET https://drive.io/api/graphify/jobs/{job_id}
```

**Completed response:**
```json
{
  "job_id": "job_8f2k9x",
  "status": "complete",
  "duration_seconds": 38,
  "result": {
    "graph_id": "grph_N37X6P9R2Z",
    "namespace": "acme",
    "node_count": 142,
    "edge_count": 389,
    "pointer": "https://drive.io/g/acme/latest",
    "versioned_pointer": "https://drive.io/g/acme/v3",
    "tiers": {
      "L0": "Acme knowledge graph: 142 nodes, 389 edges, 4 depth levels",
      "L1": "https://drive.io/g/acme/latest?tier=L1",
      "L2": "https://drive.io/g/acme/latest?tier=L2"
    }
  }
}
```

### 2.4 Tier Auto-Generation for Graph Artifacts

When a graph is ingested, drive.io auto-generates L0/L1/L2 tiers at the graph level AND per-node level.

**Graph-level tiers:**

| Tier | Content | Approx tokens |
|---|---|---|
| L0 | One-line graph summary: namespace, node count, edge count, top-level topics | ~80 tokens |
| L1 | Top 20 nodes by centrality + edge summary + key relationship clusters | ~2,000 tokens |
| L2 | Full `graph.json` | Full content |

**Node-level tiers** (generated per node, stored individually):

| Tier | Content |
|---|---|
| L0 | Node label + type + one-sentence property summary |
| L1 | Full node properties + direct neighbor list (no content) |
| L2 | Full node content via source artifact pointer |

---

## Phase 3 — Agent-Facing Query API

Agents interact with graphified data through drive.io's existing pointer model, extended with graph-specific query parameters. No new SDKs required for basic use — it's HTTP.

### 3.1 Graph Fetch with Tiered Retrieval

```
GET https://drive.io/g/{namespace}/latest?tier=L0
→ ~80 tokens — graph summary for routing decisions

GET https://drive.io/g/{namespace}/latest?tier=L1
→ ~2,000 tokens — top nodes + edge map for planning

GET https://drive.io/g/{namespace}/latest?tier=L2
→ full graph.json — deep analysis only
```

### 3.2 Node Traversal

```
GET https://drive.io/g/{namespace}/nodes/{node_id}
→ returns node with its direct neighbors

GET https://drive.io/g/{namespace}/nodes/{node_id}?depth=2
→ returns node + 2-hop neighborhood

GET https://drive.io/g/{namespace}/nodes/{node_id}?tier=L0
→ returns node L0 summary only (~15 tokens)
```

### 3.3 Graph Query (Natural Language + Structured)

```
GET https://drive.io/g/{namespace}/query?q=who+are+the+key+stakeholders
→ returns top-N nodes most relevant to query, with L0 summaries

GET https://drive.io/g/{namespace}/query?q=revenue+anomalies&tier=L1
→ returns relevant nodes at L1 depth

POST https://drive.io/g/{namespace}/query
{
  "query": "find all documents referencing Q3 revenue",
  "filters": {
    "node_type": "document",
    "date_range": { "after": "2026-01-01" }
  },
  "return_tier": "L1",
  "max_results": 10
}
```

### 3.4 Graph Annotation (Agent Write-Back)

Agents can annotate nodes with findings, creating a living knowledge layer:

```
POST https://drive.io/g/{namespace}/nodes/{node_id}/annotate
{
  "agent_id": "analysis-agent-v2",
  "annotation_type": "finding",
  "content": "Anomaly detected in week 11 revenue data — 23% spike unexplained by seasonal patterns",
  "confidence": 0.91,
  "references": ["https://drive.io/c/K82M4P1X9A"]
}
```

Annotations are stored as edge-linked annotation nodes — they don't mutate the original graph structure, so the source data stays clean.

### 3.5 SDK Convenience Methods (Python + JS)

```python
from driveio import GraphClient

graph = GraphClient(namespace="acme", api_key=os.environ["DRIVEIO_KEY"])

# Tiered graph fetch
summary = graph.fetch(tier="L0")           # ~80 tokens
overview = graph.fetch(tier="L1")          # ~2,000 tokens

# Node operations
node = graph.node("node_001").fetch(tier="L1")
neighbors = graph.node("node_001").neighbors(depth=2)

# Natural language query
results = graph.query("revenue anomalies in Q3", tier="L1", limit=5)

# Annotation
graph.node("node_001").annotate(
    type="finding",
    content="Anomaly detected in week 11",
    confidence=0.91
)
```

```typescript
// JavaScript / TypeScript
import { GraphClient } from '@driveio/sdk';

const graph = new GraphClient({ namespace: 'acme', apiKey: process.env.DRIVEIO_KEY });

const summary = await graph.fetch({ tier: 'L0' });
const results = await graph.query('revenue anomalies', { tier: 'L1' });
```

---

## Phase 4 — Human-Facing Dashboard (Graph Layer)

Extends the existing artifact library dashboard (PRD 1) with graph-specific views. All graph views are additive — they appear only when the artifact type is `graph/*`.

### 4.1 Graph Library View

In the artifact list, graph artifacts get a distinct treatment:

- Icon: graph/network symbol, distinct from file type icons
- Display name: namespace + version + node count (e.g. "acme — v3 — 142 nodes")
- Metadata strip: node count, edge count, last ingested date, source artifact count
- Status badge: `current` / `stale` (if source artifacts have been updated since last ingest)
- Actions on hover: View Graph, Re-ingest, Copy Pointer, Download JSON

### 4.2 Graph Detail View

Clicking a graph artifact opens a dedicated graph detail page (not a modal — full page):

**Left panel — Graph info:**
- Namespace, version, created/updated timestamps
- Node count, edge count, graph depth
- Source artifacts list (linked to artifact library entries)
- Pointer URL with copy button
- Re-ingest button
- Download graph.json button

**Center panel — Graph visualization:**
- Interactive force-directed graph rendered with D3.js or Cytoscape.js
- Nodes sized by centrality (more connected = larger)
- Edges colored by relationship type
- Click a node: opens node detail in right panel
- Zoom, pan, fit-to-screen controls
- Filter controls: node type, relationship type, date range
- Search: highlight matching nodes by label or property

**Right panel — Node detail (on click):**
- Node label, type, properties
- L0 summary (always visible)
- L1 content (expandable)
- L2 full content (link to source artifact)
- Annotations list (from agents)
- Neighbor list with relationship labels
- Copy node pointer button

### 4.3 Graph Search

A dedicated search surface within the graph detail view:

- Full-text search across node labels and L0 summaries
- Filter by: node type, relationship type, agent annotation, date
- Results shown as a ranked node list — click to highlight in graph visualization
- "Ask the graph" mode (v1.2): natural language query routed to the `/query` endpoint, results highlighted in the visualization

### 4.4 Re-ingest & Version Management

Every time Graphify is re-run on a namespace, drive.io stores a new graph version:

- `drive.io/g/acme/latest` — always the most recent
- `drive.io/g/acme/v1`, `/v2`, `/v3` — versioned history
- Dashboard shows version history with diff summary: "+12 nodes, -3 edges, 8 annotations added"
- One-click rollback to any prior version
- Side-by-side diff view (v1.2): compare two graph versions visually

### 4.5 Ingest Job Status in Dashboard

When a re-ingest is triggered from the dashboard, show live job progress:

```
⬤ Processing — Graphify traversing 847 source files...
⬤ Indexing — Building node index (142 nodes found)...
⬤ Generating tiers — L0/L1 summaries...
✓ Complete — Graph v4 ready. 6 new nodes, 14 new edges.
```

---

## API Surface Summary

### New Endpoints Added to drive.io

| Method | Endpoint | Description |
|---|---|---|
| `PROPFIND` | `/webdav/{namespace}/` | WebDAV directory listing |
| `GET` | `/webdav/{namespace}/{path}` | WebDAV file read |
| `PUT` | `/webdav/{namespace}/{path}` | WebDAV file write |
| `DELETE` | `/webdav/{namespace}/{path}` | WebDAV file delete |
| `MKCOL` | `/webdav/{namespace}/` | WebDAV namespace create |
| `POST` | `/api/graphify/ingest` | Trigger Graphify ingest job |
| `GET` | `/api/graphify/jobs/{job_id}` | Poll ingest job status |
| `GET` | `/g/{namespace}/latest` | Fetch graph (with tier param) |
| `GET` | `/g/{namespace}/{version}` | Fetch specific graph version |
| `GET` | `/g/{namespace}/nodes/{id}` | Fetch node (with tier + depth params) |
| `GET` | `/g/{namespace}/query` | Query graph (natural language) |
| `POST` | `/g/{namespace}/query` | Query graph (structured) |
| `POST` | `/g/{namespace}/nodes/{id}/annotate` | Agent annotation write-back |
| `GET` | `/g/{namespace}/versions` | List graph version history |
| `GET` | `/api/graphify/jobs` | List all ingest jobs for namespace |

### Existing Endpoints — Unchanged

All existing drive.io endpoints (`/api/upload`, `/api/fetch`, `/c/{hash}`) remain exactly as documented. Graph artifacts are additive — they do not change the existing artifact relay model.

---

## Implementation Milestones

### v1.0 — Filesystem Bridge
- WebDAV adapter: `PROPFIND`, `GET`, `PUT`, `DELETE`, `MKCOL`
- rclone config documentation and one-liner setup
- Basic authentication (Bearer token)
- Integration test: rclone mount → Graphify run → output readable via drive.io

### v1.1 — Graph Ingest + Storage
- `POST /api/graphify/ingest` with async job model
- `graph.json` storage schema and `graph/*` artifact types
- L0/L1/L2 auto-generation at graph level
- Poll endpoint for job status
- Webhook on complete

### v1.2 — Agent Query API
- `GET /g/{namespace}/latest` with tier params
- Node traversal with depth param
- Natural language query endpoint
- Python + JS SDK graph methods

### v1.3 — Dashboard Graph Views
- Graph artifact type in artifact library list
- Graph detail page with D3/Cytoscape visualization
- Node detail panel
- Graph search

### v1.4 — Agent Annotation + Versioning
- Annotation write-back endpoint
- Version history storage
- `latest` vs `v{n}` pointer resolution
- Dashboard version history view

### v1.5 — Advanced Dashboard
- Re-ingest trigger from dashboard
- Live job progress in dashboard
- Version diff summary
- "Ask the graph" natural language mode in dashboard

---

## Open Technical Questions

**1. Graphify output format stability**
Graphify's `graph.json` schema needs to be confirmed before building the storage layer. If the schema is still in flux, build the ingest adapter with a version field and schema migration path baked in from day one.

**2. Node-level vs. graph-level pointer granularity**
Do agents need individual pointers for every node (supporting single-node fetch at 7 tokens), or is graph-level tiered retrieval (L0/L1/L2) sufficient for most agent use cases? Recommendation: ship graph-level tiers first (v1.1), add per-node pointers at v1.2 based on actual agent usage patterns.

**3. Graph size limits**
A deep Graphify run on a large codebase could produce a `graph.json` in the tens of MB with thousands of nodes. Define shard thresholds early: at what node count does a graph get split into sub-graphs? Recommendation: set initial limit at 10,000 nodes, auto-shard above that into topic clusters.

**4. L0/L1 generation for graph artifacts**
L0/L1 tiers for a graph require semantic summarization of the node set — this is an LLM call at ingest time. Define whether this is synchronous (blocks the ingest job) or async (graph available before tiers are ready). Recommendation: async with a `tiers_ready` flag in the job status response.

**5. WebDAV write semantics and conflict resolution**
If two agents both write to the same WebDAV path simultaneously, which write wins? Drive.io's existing last-write-wins behavior is fine for artifact relay but may be problematic for source files that Graphify will ingest. Recommendation: add an `If-Match` ETag header to WebDAV `PUT` for optimistic concurrency, consistent with WebDAV spec.

---

## Security Considerations

- WebDAV paths are scoped strictly to the authenticated user's namespaces — no cross-namespace access
- All existing drive.io security guarantees apply: end-to-end encryption, zero-log policy, burn-on-read option
- Graph L0 summaries must not contain sensitive data — the ingest pipeline should strip PII before L0 generation (flag for enterprise tier)
- Annotation write-back is permissioned separately from read — an agent can be granted read-only graph access without annotation rights
- WebDAV `DELETE` is a soft delete — content is retained for the standard retention window even if deleted via WebDAV, consistent with drive.io's existing model

---

*Implementation Plan v1.0 — May 2026. Internal use — Pre-YC Application.*
