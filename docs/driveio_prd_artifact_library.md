# PRD: Human-Facing Artifact Library
## Browsable & Searchable Dashboard for Agent-Created Artifacts

**Document type:** Product Requirements Document  
**Status:** Draft — Pre-YC  
**Version:** 1.0  
**Sequence:** This is PRD 1 of 2. PRD 2 (Named Namespace & Agent-Side Memory) builds on top of this.

---

## Problem Statement

Drive.io currently gives users a hash URL for every artifact their agent creates — e.g. `https://drive.io/c/gkR5mvo2cF`. The artifact is retrievable if the user has the link. The dashboard shows an observability view (token savings, latency) and a basic file list.

The file list is not useful in its current form. Every entry is an opaque hash. There is no way to tell what a file contains, when it was created, what type it is, or which agent made it without clicking through each one individually. There is no search. There is no filter.

The practical result: users who generate artifacts across multiple sessions — content calendars, brand documents, data outputs, reports — cannot find what their agents made without either remembering the exact URL or scrolling through an undifferentiated list of hashes.

This is the same frustration documented in the PaperClip AI community, where users described having to "dig up the ticket number" to reference prior agent work, and one user built a custom plugin just to get a searchable document index. Drive.io already has the infrastructure to solve this properly. This PRD closes the gap between infrastructure that works and a dashboard that's actually usable.

---

## Current State

| Capability | Status |
|---|---|
| Artifacts uploaded and stored | ✅ Live |
| Hash URL generated per artifact | ✅ Live |
| Artifact retrievable via URL | ✅ Live |
| Observability view (token savings, latency) | ✅ Live |
| Basic file list in dashboard | ✅ Live — but hash-only, no metadata |
| Search across artifacts | ❌ Missing |
| Filter by type, date, or agent | ❌ Missing |
| Human-readable artifact identity | ❌ Missing |
| File type icons / visual differentiation | ❌ Missing |
| Preview artifact content inline | ❌ Missing |

---

## Goals

1. Every artifact in the dashboard is identifiable at a glance — the user can tell what it is, when it was created, what type it is, and which agent made it, without clicking into it.
2. Users can search across all their artifacts by filename, content type, or creating agent.
3. Users can filter by file type and sort by date or name.
4. Users can preview artifact content without leaving the dashboard.
5. Users can copy the artifact URL directly from the list.
6. The upgrade path to named artifacts (PRD 2) is not blocked — the data model and UI patterns established here should extend cleanly to named URIs when that work ships.

---

## Non-Goals

- This PRD does not introduce named artifacts, namespaces, or `drive://` URIs. Those are PRD 2.
- This PRD does not introduce tagging. Tags require named artifacts as a foundation.
- This PRD does not change the upload API or artifact storage model.
- This PRD does not introduce agent-queryable search. That is also PRD 2.
- This PRD does not introduce versioning.

---

## What Changes at Upload Time

To make artifacts identifiable in the dashboard, drive.io needs to capture and store a small amount of metadata at upload time. This is additive — it does not break existing integrations.

**Metadata to capture at upload:**

| Field | Source | Notes |
|---|---|---|
| `filename` | Inferred from content or supplied by caller | Best-effort; falls back to hash if absent |
| `content_type` | MIME type from upload request | e.g. `text/markdown`, `application/json`, `text/csv` |
| `created_at` | Server timestamp | Already exists implicitly; needs to be surfaced |
| `agent_id` | API key or caller-supplied label | Identifies which agent or skill created the artifact |
| `size_bytes` | Content length | Already available |

No changes are required to the upload response. The hash URL continues to be the canonical identifier. Metadata is stored server-side and surfaced in the dashboard only.

---

## Dashboard Changes

### File List — Current vs. New

**Current:**
Each row shows a hash URL and nothing else. No metadata, no icons, no differentiation.

**New:**
Each row shows:
- File type icon (derived from `content_type`) — MD, JSON, CSV, PDF, TXT, etc.
- Inferred filename or a humanized hash if no filename is available (e.g. "artifact-gkR5m" rather than the raw hash)
- Full hash URL in muted monospace beneath the filename
- Creation date (relative: "2 days ago", "May 2")
- Creating agent or skill name
- File size
- Copy URL button inline on hover

Rows are sorted newest-first by default.

### Search

A search input at the top of the file list. Searches across:
- Inferred filename
- Content type / file extension
- Agent name

Search is client-side for lists under ~500 artifacts; server-side pagination + search for larger collections. Results update as the user types with no submit required.

### Filter & Sort Controls

Three controls alongside the search input:

**Type filter** (dropdown): All types / Markdown / JSON / CSV / PDF / Other  
**Sort** (dropdown): Newest first / Oldest first / Largest first / Name A–Z  
**Date range** (optional, v1.1): filter to artifacts created within the last 7 days, 30 days, 90 days, or custom range

### Inline Preview

Clicking a row expands a preview panel below it (not a separate page — the user stays in the list context).

Preview behavior by type:
- **Markdown** — rendered HTML preview, truncated at ~500 words with a "show more" control
- **JSON** — syntax-highlighted, collapsible tree, truncated at top level
- **CSV** — first 10 rows rendered as a table
- **PDF** — first page rendered as an image
- **Other** — raw text preview, first 50 lines, monospace

The preview panel also surfaces:
- Full hash URL with a one-click copy button
- File size and exact creation timestamp
- Creating agent name
- A "Download" button for the raw file
- A placeholder label where the artifact name will appear once PRD 2 ships: "Unnamed artifact — add a name" (non-interactive in this PRD, sets up the pattern)

### Empty State

When the file list is empty (new user, or all artifacts expired):

> "Your agents haven't created any artifacts yet. Use the drive.io skill to upload a file, and it will appear here."

With a link to the skill documentation.

### Loading & Performance

The file list should render within 200ms for collections up to 500 artifacts. Pagination kicks in above 500 — 50 artifacts per page, with next/previous controls and a total count. Search across all pages is handled server-side.

---

## Metadata Inference — Filename Handling

Most drive.io uploads today come from agent skills that don't supply an explicit filename. The dashboard needs to show something human-readable regardless.

Fallback hierarchy for display name:

1. Explicit filename supplied at upload (ideal — skill can be updated to supply this)
2. Content-type-derived label + short hash: e.g. "markdown-gkR5m", "csv-N37X6"
3. Raw hash only (current behavior — should never be the displayed name after this ships)

The skill instruction file should be updated alongside this PRD to encourage the agent to supply a descriptive filename at upload time. Example:

**Before:**
```
POST https://drive.io/api/upload
{ "content": "..." }
```

**After (recommended):**
```
POST https://drive.io/api/upload
{ "content": "...", "filename": "linkedin-content-calendar.md" }
```

This is a soft recommendation, not a breaking change. Existing integrations continue to work; the dashboard just shows a better label for new uploads.

---

## Upgrade Path to PRD 2

This PRD deliberately avoids introducing namespaces, named URIs, or tags — but the UI patterns it establishes must extend cleanly when those features ship.

Specifically:

- The "Unnamed artifact — add a name" placeholder in the preview panel is the future entry point for named artifact assignment.
- The file list row layout (icon + name + URI + metadata) is designed to accommodate a `drive://namespace/name` URI beneath the display name in PRD 2, replacing the hash URI currently shown.
- The search infrastructure built here (indexed on filename, type, agent) is the same index that will support namespace and tag filtering in PRD 2.
- No UI element introduced in this PRD should need to be removed or restructured in PRD 2 — only extended.

---

## Milestones

**v1.0 — Metadata capture + enriched file list**  
Capture filename, content_type, created_at, agent_id, size_bytes at upload. Update the file list to show this metadata. File type icons. Humanized display names. Copy URL on hover. Newest-first sort by default.

**v1.1 — Search and filter**  
Search input across filename, type, and agent. Type filter dropdown. Sort controls. Client-side for small collections, server-side for large.

**v1.2 — Inline preview**  
Expandable preview panel per row. Rendered markdown, JSON tree, CSV table, PDF page image. Download button. "Add a name" placeholder for PRD 2.

**v1.3 — Date range filter + pagination**  
Date range filter for larger collections. Server-side pagination at 500+ artifacts.

---

## Success Metrics

| Metric | Target | Timeframe |
|---|---|---|
| Time to locate a specific prior artifact (user test) | Under 30 seconds | At v1.1 launch |
| % of users who open the file list at least once per week | Baseline → measurable increase | 30 days post v1.0 |
| Support / feedback reports of "can't find my file" | Decline vs. pre-launch baseline | 30 days post v1.1 |
| Artifacts with agent-supplied filenames (vs. hash fallback) | >60% of new uploads | 60 days post skill update |

---

## Open Questions

1. **Filename from skill vs. inferred server-side:** Should drive.io attempt to infer a filename from content on the server side (e.g. parse the first heading of a markdown file), or rely entirely on the uploading agent to supply one? Server-side inference is more robust for existing uploads but adds processing overhead.

2. **Artifact expiry and the file list:** Do expired artifacts (past retention window) remain in the file list as greyed-out entries, or are they removed entirely? Greyed-out is more informative but may clutter the list for free-tier users with short retention windows.

3. **Agent identity display:** The `agent_id` field is currently an API key identifier. What should be shown in the dashboard — the raw key prefix, a user-assigned label, or the skill name if available? Skill name is most useful but requires the skill to self-identify at upload time.

4. **Preview security:** Inline preview renders artifact content in the dashboard. For users who upload sensitive content, is there a preference to disable preview rendering and show only metadata? This may be relevant for enterprise users in PRD 2 but worth flagging now.

---

*Draft prepared May 2026. For internal use — Pre-YC Application.*
