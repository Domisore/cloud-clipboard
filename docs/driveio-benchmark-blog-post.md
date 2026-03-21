# We Measured Token Usage Across 5 Payload Types in Multi-Agent Pipelines. Here's What We Found.

**Published by the Drive.io Team · March 2026 · 7 min read**

---

Passing raw data between AI agents is expensive — and most teams don't realize how expensive until they're staring at an API bill they can't explain.

The assumption baked into most multi-agent architectures is that inline data transfer is fine. You've got a context window, you put the data in it, the next agent reads it, job done. It works. But it scales catastrophically as payloads grow, pipelines lengthen, and runs multiply.

Before we get into the numbers, it's worth being precise about what problem we're actually solving — because the agent infrastructure space is moving fast and the terminology is getting blurry.

---

## Memory Layers vs. Artifact Relays — Two Different Problems

A new generation of tooling has emerged to address the context problem in agentic AI. Mem0 and Zep are two of the most prominent examples, and they're excellent at what they do. But what they do is specifically this: help agents *remember the past*.

When a user comes back to a session after three days, Mem0 or Zep can surface relevant entities, preferences, and historical context so the agent isn't starting from scratch. They're solving the **forgetful agent problem** — persistence and retrieval of semantic memory across sessions.

Drive.io solves a different problem entirely: **what happens to your context window mid-run, right now, when one agent needs to hand a 100KB dataset to another.**

The analogy is simple:
- **Mem0/Zep** are RAM that persists between reboots (long-term episodic memory).
- **Drive.io** is a bus that moves large payloads between processors without clogging the CPU cache (O(1) intra-pipeline efficiency).

| Layer | What it solves | When it matters | Examples |
|---|---|---|---|
| **Memory** | Agents forget past sessions and user context | Between runs, across sessions | Mem0, Zep |
| **Artifact Relay** | Passing large files mid-run burns token budget | Inside a live pipeline run | **Drive.io** |
| **Orchestration** | Coordinating agent tasks and dependencies | Throughout a run | LangGraph, CrewAI |

These layers are complementary, not competing. A well-architected pipeline might use Zep to retrieve user preferences at the start of a run, Drive.io to relay datasets between agents mid-run, and LangGraph to coordinate the workflow throughout. Our lane is specifically **intra-pipeline efficiency**: the moment one agent needs to hand something large to another without either agent's context window paying the price.

With that established — here's what the data actually looks like.

---

## The Setup

We wanted to put real numbers on the problem — not estimates, not heuristics, actual token counts across representative workloads. So we built a test suite, ran it 20 times per payload type, and published everything, including the parts that didn't flatter us.

We tested five payload types that represent the most common data artifacts passed between agents in production pipelines:

- **Small JSON** (1KB) — config objects, structured outputs, tool call results
- **Code Module** (10KB) — Python/JS files, agent-generated scripts
- **CSV Dataset** (100KB) — tabular outputs, analysis results, scraped data
- **Base64 Image** (300KB) — vision model inputs/outputs, screenshots, charts
- **Log File** (1MB) — agent traces, execution histories, debug output

For each payload, we measured token consumption using `cl100k_base` — the same tokenizer used by GPT-4, GPT-4o, and most production LLM deployments today. We ran 20 iterations per payload using programmatically generated representative content to account for variance, and reported the mean.

We compared three transfer strategies:

1. **Raw inline** — the payload is passed directly in the context message
2. **S3 URL** — the payload is stored in S3 and passed as a standard HTTPS URL
3. **Drive.io pointer** — the payload is offloaded via the Drive.io API and passed as a 7-token pointer URL

Retrieval latency for the pointer-based approach was measured at CDN edge round-trip — we'll come back to this, because it's the honest tradeoff.

---

## The Results

| Test Case | Size | Raw Tokens (mean) | S3 URL Tokens | Drive.io Tokens | Savings vs Raw | Retrieval Latency |
|---|---|---|---|---|---|---|
| Small JSON | 1KB | 284 ±6.2 | 68 | 7 | **97.54%** | 31ms ±8.4 |
| Code Module | 10KB | 2,701 ±18.4 | 68 | 7 | **99.74%** | 29ms ±7.9 |
| CSV Dataset | 100KB | 27,431 ±94.1 | 68 | 7 | **99.97%** | 33ms ±9.1 |
| Base64 Image | 300KB | 101,842 ±310.7 | 68 | 7 | **99.99%** | 28ms ±7.2 |
| Log File | 1MB | 234,918 ±701.3 | 68 | 7 | **99.99%** | 32ms ±8.8 |

A few things worth unpacking.

---

## What This Actually Means in Production

### The 7-token floor is real and consistent.

Across every payload size — from a 1KB JSON blob to a 1MB log file — the Drive.io pointer URL tokenized to exactly 7 tokens. This isn't a compression trick or a rounding artifact. The URL structure is designed to hit this number deterministically, regardless of what's behind it. We verified this across dozens of fresh runs.

This means your token cost per handoff becomes **O(1)** with respect to payload size. The cost of passing a dataset is the same as passing a config. That's a meaningful architectural property, not just a benchmark win.

### Standard S3 URLs don't solve this.

A lot of teams assume that "just use a URL" is good enough. It's better than raw inline — 68 tokens vs. 284+ — but it's still 10x worse than a pointer-based relay, and it comes with no TTL management, no provenance logging, and no agent-native tooling. S3 URL tokens also vary with bucket name, region, and path length in ways that are annoying to control at scale.

### Context window exhaustion is the underrated problem.

The token savings are compelling. But the more important issue is context window exhaustion — and this is where the distinction from memory layers matters most. Memory tools like Mem0 and Zep are excellent at compressing *historical* context across sessions. They don't address the live context pressure that builds inside a single active run when agents are passing large artifacts to each other.

A 100KB CSV passed inline consumes ~27,431 tokens — **roughly 21% of a GPT-4o 128K context window** — in a single handoff. In a multi-step pipeline, this compounds fast. By turn 7 of an agent run with moderate attachments, you're often fighting context pressure that degrades output quality before you ever hit a hard limit. Offloading artifacts to a pointer relay eliminates this class of problem entirely — at the moment it occurs, not by summarizing after the fact.

### Base64 is worse than you think.

The common heuristic for base64 token estimation is ~4 characters per token, which would put a 300KB image at around 76,800 tokens. The actual `cl100k_base` count is **101,842** — 33% higher — because base64 character patterns tokenize less efficiently than natural language or code. If you're passing vision model outputs between agents inline, you're likely burning significantly more budget than your estimates suggest.

---

## The Honest Tradeoffs

We said we'd come back to latency, so here it is.

**Retrieval adds ~30ms per hop.** In a 10-step pipeline, that's approximately 300ms of added latency. For most agentic workflows — where individual model inference takes 1–20 seconds — this is negligible. For latency-sensitive, synchronous applications, it's worth weighing.

**Outbound HTTP is required.** The receiving agent needs to be able to make an external HTTP request to retrieve the artifact. This won't work in air-gapped, sandboxed, or highly restricted runtimes. If your agents run in isolated environments, pointer-based relay isn't an option without network configuration changes.

**Encryption overhead isn't counted here.** Our benchmarks measure transfer size and token count, not the minor serialization and encryption cost that Drive.io's SDK adds on upload. In practice this is negligible, but it's not zero.

---

## Reproduce It Yourself

We're not asking you to take our word for it. Here's the full reproduction path:

```bash
# Install dependency
npm install @dqbd/tiktoken

# Run test suite
node benchmark-driveio.mjs
```

The test suite uses programmatically generated representative payloads rather than fixed files, so results will vary slightly per run. The mean across 20 runs is the reportable number — consistent with what we've published here.

Note: These benchmarks use `cl100k_base`. Claude and Gemini models use different tokenizers; savings percentages will vary slightly, but the directional result holds across all major tokenization schemes we've tested.

---

## What We're Building

Drive.io is a cross-framework artifact relay for AI agent pipelines. Any payload — files, datasets, code modules, images — becomes a 7-token pointer URL via a single API call. It works natively with LangGraph, CrewAI, AutoGen, and any framework that can make an HTTP request.

It's not a memory layer. It doesn't replace Mem0, Zep, or any session-persistence tooling you're already running. It's the missing piece that sits *between* agents during a live run — handling the large, ephemeral payloads that would otherwise blow up your context mid-pipeline.

We also ship a native MCP server for Claude Desktop and compatible agents, a Python SDK, and an A2A async webhook protocol for fully autonomous handoffs.

If you're running multi-agent pipelines and watching your token costs climb, the relay is free to start — no database provisioning, no complex auth.

[**Get your Agent API Key →**](https://drive.io)

---

*Benchmarks produced using `cl100k_base` (tiktoken). Retrieval latency measured at CDN edge round-trip. Savings percentages are relative to raw inline transfer. Results for Claude and Gemini may vary based on tokenization scheme.*

---

**Tags:** `multi-agent` `LLM token optimization` `LangGraph` `CrewAI` `AutoGen` `AI infrastructure` `MCP` `agent pipelines` `Mem0` `Zep` `agent memory`
