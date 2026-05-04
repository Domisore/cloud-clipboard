import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const tokenData = [
  { time: "00:00", raw: 234918, saved: 234911, pointer: 7 },
  { time: "04:00", raw: 187420, saved: 187413, pointer: 7 },
  { time: "08:00", raw: 312440, saved: 312433, pointer: 7 },
  { time: "12:00", raw: 489200, saved: 489193, pointer: 7 },
  { time: "16:00", raw: 401882, saved: 401875, pointer: 7 },
  { time: "20:00", raw: 278330, saved: 278323, pointer: 7 },
  { time: "Now",   raw: 344910, saved: 344903, pointer: 7 },
];

const tierData = [
  { tier: "L0", count: 4821, label: "Abstract", tokens: 100, color: "#00ff88" },
  { tier: "L1", count: 1943, label: "Overview", tokens: 2000, color: "#00cfff" },
  { tier: "L2", count: 312,  label: "Details",  tokens: 27431, color: "#ff6b35" },
];

const hopData = [
  { hop: "Hop 1", ms: 29 },
  { hop: "Hop 2", ms: 33 },
  { hop: "Hop 3", ms: 28 },
  { hop: "Hop 4", ms: 31 },
  { hop: "Hop 5", ms: 35 },
  { hop: "Hop 6", ms: 27 },
  { hop: "Hop 7", ms: 32 },
  { hop: "Hop 8", ms: 30 },
];

const pipelineEvents = [
  { agent: "ingest-agent",   framework: "LangGraph",   artifact: "sales_q1.csv",      tier: "L2", tokens: 27431, saved: 27424, ms: 33, ts: "16:42:01" },
  { agent: "plan-agent",     framework: "CrewAI",      artifact: "market_brief.json", tier: "L1", tokens: 2000,  saved: 1993,  ms: 29, ts: "16:42:04" },
  { agent: "filter-agent",   framework: "AutoGen",     artifact: "sales_q1.csv",      tier: "L0", tokens: 100,   saved: 93,    ms: 28, ts: "16:42:07" },
  { agent: "analysis-agent", framework: "LangGraph",   artifact: "sales_q1.csv",      tier: "L2", tokens: 27431, saved: 27424, ms: 31, ts: "16:42:11" },
  { agent: "summary-agent",  framework: "OpenAI SDK",  artifact: "report_draft.md",   tier: "L1", tokens: 2000,  saved: 1993,  ms: 30, ts: "16:42:15" },
  { agent: "review-agent",   framework: "CrewAI",      artifact: "report_draft.md",   tier: "L0", tokens: 100,   saved: 93,    ms: 27, ts: "16:42:18" },
];

const tierColors = { L0: "#00ff88", L1: "#00cfff", L2: "#ff6b35" };
const frameworkColors = {
  "LangGraph": "#a78bfa",
  "CrewAI": "#fb923c",
  "AutoGen": "#38bdf8",
  "OpenAI SDK": "#4ade80",
};

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 8,
      padding: "20px 24px",
      borderLeft: `3px solid ${accent}`,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#555", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10,
      fontFamily: "'IBM Plex Mono', monospace",
      textTransform: "uppercase",
      letterSpacing: "0.15em",
      color: "#444",
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <span style={{ display: "inline-block", width: 16, height: 1, background: "#333" }} />
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0d0d0d",
        border: "1px solid #222",
        borderRadius: 4,
        padding: "8px 12px",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        color: "#aaa",
      }}>
        <div style={{ color: "#fff", marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()}</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DriveIODashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const totalSaved = tokenData.reduce((acc, d) => acc + d.saved, 0);
  const totalFetches = tierData.reduce((acc, d) => acc + d.count, 0);
  const l0pct = Math.round((tierData[0].count / totalFetches) * 100);
  const avgLatency = Math.round(hopData.reduce((a, d) => a + d.ms, 0) / hopData.length);

  return (
    <div style={{
      background: "#080808",
      minHeight: "100vh",
      color: "#e0e0e0",
      fontFamily: "'IBM Plex Sans', sans-serif",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid #141414",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#080808",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 14,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}>
            drive<span style={{ color: "#ff6b35" }}>.io</span>
          </div>
          <div style={{ width: 1, height: 16, background: "#222" }} />
          <div style={{ fontSize: 12, color: "#444", fontFamily: "'IBM Plex Mono', monospace" }}>
            observability
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
          <span style={{ fontSize: 11, color: "#00ff88", fontFamily: "'IBM Plex Mono', monospace" }}>live</span>
          <span style={{ fontSize: 11, color: "#333", fontFamily: "'IBM Plex Mono', monospace", marginLeft: 12 }}>
            pipeline:acme-q3-report
          </span>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{ borderBottom: "1px solid #111", padding: "0 32px", display: "flex", gap: 0 }}>
        {["overview", "pipeline", "artifacts"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: "none",
            border: "none",
            borderBottom: activeTab === tab ? "2px solid #ff6b35" : "2px solid transparent",
            color: activeTab === tab ? "#fff" : "#444",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "14px 20px",
            cursor: "pointer",
            transition: "color 0.15s",
          }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1100 }}>

        {activeTab === "overview" && (
          <>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
              <StatCard
                label="Tokens Saved (24h)"
                value={`${(totalSaved / 1000000).toFixed(1)}M`}
                sub="vs raw inline transfer"
                accent="#00ff88"
              />
              <StatCard
                label="Total Fetches"
                value={totalFetches.toLocaleString()}
                sub={`${l0pct}% resolved at L0`}
                accent="#00cfff"
              />
              <StatCard
                label="Avg Hop Latency"
                value={`${avgLatency}ms`}
                sub="CDN edge P50"
                accent="#a78bfa"
              />
              <StatCard
                label="Pointer Size"
                value="7 tok"
                sub="constant, all payload sizes"
                accent="#ff6b35"
              />
            </div>

            {/* Token savings chart */}
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid #141414",
              borderRadius: 8,
              padding: "20px 24px",
              marginBottom: 20,
            }}>
              <SectionLabel>Token savings over time</SectionLabel>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={tokenData}>
                  <XAxis dataKey="time" tick={{ fill: "#444", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#444", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="raw" stroke="#333" strokeWidth={1} dot={false} name="raw tokens" />
                  <Line type="monotone" dataKey="saved" stroke="#00ff88" strokeWidth={2} dot={false} name="tokens saved" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Tier distribution + latency */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #141414",
                borderRadius: 8,
                padding: "20px 24px",
              }}>
                <SectionLabel>Retrieval tier distribution</SectionLabel>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={tierData} barSize={36}>
                    <XAxis dataKey="tier" tick={{ fill: "#555", fontSize: 11, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#444", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="fetches" radius={[3, 3, 0, 0]}>
                      {tierData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
                  {tierData.map(t => (
                    <div key={t.tier} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10 }}>
                      <span style={{ color: t.color }}>{t.tier}</span>
                      <span style={{ color: "#444", marginLeft: 4 }}>{t.label} · {((t.count / totalFetches) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid #141414",
                borderRadius: 8,
                padding: "20px 24px",
              }}>
                <SectionLabel>Hop latency (ms)</SectionLabel>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={hopData} barSize={20}>
                    <XAxis dataKey="hop" tick={{ fill: "#444", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 50]} tick={{ fill: "#444", fontSize: 10, fontFamily: "IBM Plex Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="ms" name="latency ms" fill="#a78bfa" fillOpacity={0.7} radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#444", marginTop: 12 }}>
                  10-step pipeline accumulated: <span style={{ color: "#a78bfa" }}>~{avgLatency * 10}ms total overhead</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "pipeline" && (
          <>
            <div style={{ marginBottom: 20 }}>
              <SectionLabel>Live pipeline events — acme-q3-report</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Header row */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "90px 120px 130px 180px 60px 80px 70px 60px",
                  padding: "8px 16px",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 10,
                  color: "#333",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}>
                  <span>Time</span>
                  <span>Agent</span>
                  <span>Framework</span>
                  <span>Artifact</span>
                  <span>Tier</span>
                  <span>Tokens In</span>
                  <span>Saved</span>
                  <span>Latency</span>
                </div>
                {pipelineEvents.map((e, i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "90px 120px 130px 180px 60px 80px 70px 60px",
                    padding: "10px 16px",
                    background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent",
                    borderRadius: 4,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 11,
                    alignItems: "center",
                    borderLeft: `2px solid ${tierColors[e.tier]}22`,
                    transition: "background 0.1s",
                  }}>
                    <span style={{ color: "#444" }}>{e.ts}</span>
                    <span style={{ color: "#ccc" }}>{e.agent}</span>
                    <span>
                      <span style={{
                        background: `${frameworkColors[e.framework]}22`,
                        color: frameworkColors[e.framework],
                        padding: "2px 6px",
                        borderRadius: 3,
                        fontSize: 10,
                      }}>{e.framework}</span>
                    </span>
                    <span style={{ color: "#888" }}>{e.artifact}</span>
                    <span style={{
                      color: tierColors[e.tier],
                      fontWeight: 700,
                    }}>{e.tier}</span>
                    <span style={{ color: "#555" }}>{e.tokens.toLocaleString()}</span>
                    <span style={{ color: "#00ff88" }}>-{e.saved.toLocaleString()}</span>
                    <span style={{ color: "#a78bfa" }}>{e.ms}ms</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline summary */}
            <div style={{
              background: "rgba(0,255,136,0.03)",
              border: "1px solid rgba(0,255,136,0.1)",
              borderRadius: 8,
              padding: "16px 20px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              display: "flex",
              gap: 40,
              marginTop: 8,
            }}>
              <div>
                <span style={{ color: "#444", fontSize: 10 }}>PIPELINE TOTAL TOKENS USED</span>
                <div style={{ color: "#00ff88", fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                  {pipelineEvents.reduce((a, e) => a + e.tokens, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <span style={{ color: "#444", fontSize: 10 }}>VS RAW INLINE</span>
                <div style={{ color: "#ff6b35", fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                  {(pipelineEvents.reduce((a, e) => a + e.tokens, 0) * 10).toLocaleString()}
                </div>
              </div>
              <div>
                <span style={{ color: "#444", fontSize: 10 }}>TOTAL SAVED</span>
                <div style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                  {pipelineEvents.reduce((a, e) => a + e.saved, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <span style={{ color: "#444", fontSize: 10 }}>PIPELINE LATENCY OVERHEAD</span>
                <div style={{ color: "#a78bfa", fontSize: 18, fontWeight: 700, marginTop: 4 }}>
                  {pipelineEvents.reduce((a, e) => a + e.ms, 0)}ms
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "artifacts" && (
          <>
            <SectionLabel>Artifact registry</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "sales_q1.csv",      size: "100 KB", type: "CSV",    url: "drive.io/c/N37X6P9R2Z", tiers: ["L0","L1","L2"], fetches: 3, lastHit: "L2", age: "2m ago" },
                { name: "market_brief.json", size: "10 KB",  type: "JSON",   url: "drive.io/c/K82M4T1Q9X", tiers: ["L0","L1","L2"], fetches: 1, lastHit: "L1", age: "5m ago" },
                { name: "report_draft.md",   size: "28 KB",  type: "MD",     url: "drive.io/c/P91Z7W3C5V", tiers: ["L0","L1","L2"], fetches: 2, lastHit: "L0", age: "8m ago" },
                { name: "pipeline_log.txt",  size: "1024 KB",type: "LOG",    url: "drive.io/c/R55A2D8H7F", tiers: ["L0","L1","L2"], fetches: 0, lastHit: "—",  age: "12m ago" },
              ].map((a, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid #141414",
                  borderRadius: 8,
                  padding: "16px 20px",
                  display: "grid",
                  gridTemplateColumns: "200px 70px 60px 1fr 120px 80px 80px",
                  alignItems: "center",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 11,
                  gap: 8,
                }}>
                  <span style={{ color: "#ddd", fontWeight: 600 }}>{a.name}</span>
                  <span style={{ color: "#555" }}>{a.size}</span>
                  <span style={{
                    background: "#1a1a1a",
                    color: "#666",
                    padding: "2px 6px",
                    borderRadius: 3,
                    fontSize: 10,
                    textAlign: "center",
                  }}>{a.type}</span>
                  <span style={{ color: "#333", fontSize: 10 }}>{a.url}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {a.tiers.map(t => (
                      <span key={t} style={{
                        background: `${tierColors[t]}15`,
                        color: tierColors[t],
                        padding: "2px 6px",
                        borderRadius: 3,
                        fontSize: 10,
                        fontWeight: 700,
                      }}>{t}</span>
                    ))}
                  </div>
                  <span style={{ color: "#555" }}>{a.fetches} fetches</span>
                  <span style={{ color: "#444", fontSize: 10 }}>{a.age}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
