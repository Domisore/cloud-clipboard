"use client";

import { useState, useEffect, useMemo } from 'react';
import { 
    Globe, BookOpen, Key, LayoutDashboard, Tag, Brain, Webhook, Download, Settings, CreditCard, 
    ChevronRight, ChevronLeft, Menu, X, ExternalLink, Shield, Sparkles, Copy, CheckCircle2, Trash2, Eye, EyeOff, AlertTriangle, 
    RefreshCw, Search, Plus, ArrowRight, Clock, Database, Send, Check, DownloadCloud, PlayCircle, BarChart3, ChevronDown, Cpu, Sparkle,
    FolderOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtifactLibrary } from './ArtifactLibrary';
import { 
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar
} from 'recharts';
import { UserButton } from "@clerk/nextjs";

interface ApiKey {
    id: string;
    name: string;
    createdAt: number;
    usage: number;
}

interface ActivityEvent {
    id: string;
    type: string;
    timestamp: number;
    agent?: string;
    preview?: string;
    metadata?: any;
}

const BASE_MOCK_TIME = 1716391485000;

const INITIAL_PLAYGROUND_MEMORIES = [
    { id: "mem_1", text: "User likes coffee and works at Google", timestamp: BASE_MOCK_TIME - 3600000, confidence: 0.95 },
    { id: "mem_2", text: "User prefers dark mode and uses VS Code", timestamp: BASE_MOCK_TIME - 7200000, confidence: 0.88 },
    { id: "mem_3", text: "Project deadline is set for June 15th", timestamp: BASE_MOCK_TIME - 14400000, confidence: 0.76 }
];

const INITIAL_REQUEST_LOGS = [
    { id: "req_1", timestamp: BASE_MOCK_TIME - 120000, method: "POST", endpoint: "/v1/memories/add", status: 200, latency: "42ms", keyName: "crawler-agent-prod" },
    { id: "req_2", timestamp: BASE_MOCK_TIME - 240000, method: "GET", endpoint: "/v1/memories/search", status: 200, latency: "18ms", keyName: "crawler-agent-prod" },
    { id: "req_3", timestamp: BASE_MOCK_TIME - 480000, method: "POST", endpoint: "/v1/memories/add", status: 200, latency: "56ms", keyName: "ingest-worker-01" },
    { id: "req_4", timestamp: BASE_MOCK_TIME - 900000, method: "POST", endpoint: "/v1/webhooks/trigger", status: 500, latency: "124ms", keyName: "system" },
    { id: "req_5", timestamp: BASE_MOCK_TIME - 1800000, method: "GET", endpoint: "/v1/entities", status: 200, latency: "22ms", keyName: "default-key" }
];

const INITIAL_ENTITIES = [
    { id: "ent_1", name: "Google", type: "Organization", references: 12, lastUpdated: BASE_MOCK_TIME - 120000 },
    { id: "ent_2", name: "Python", type: "Language", references: 9, lastUpdated: BASE_MOCK_TIME - 480000 },
    { id: "ent_3", name: "VS Code", type: "IDE", references: 8, lastUpdated: BASE_MOCK_TIME - 7200000 },
    { id: "ent_4", name: "Seattle", type: "Location", references: 3, lastUpdated: BASE_MOCK_TIME - 14400000 },
    { id: "ent_5", name: "Acme Corp", type: "Organization", references: 2, lastUpdated: BASE_MOCK_TIME - 86400000 }
];

const INITIAL_WEBHOOK_LOGS = [
    { id: "wh_1", timestamp: BASE_MOCK_TIME - 600000, event: "memory.created", status: 200, latency: "89ms", payload: `{\n  "event": "memory.created",\n  "id": "mem_49f8a",\n  "text": "User is visiting San Francisco next week"\n}` },
    { id: "wh_2", timestamp: BASE_MOCK_TIME - 1200000, event: "entity.extracted", status: 200, latency: "94ms", payload: `{\n  "event": "entity.extracted",\n  "entity": "San Francisco",\n  "type": "Location"\n}` }
];

export function ApiKeyDashboard({ isBypass = false, plan: initialPlan = "free" }: { isBypass?: boolean; plan?: string }) {
    const [activeTab, setActiveTab] = useState<string>("overview");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [plan, setPlan] = useState(initialPlan);

    // Workspace & Projects Selectors
    const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
    const [isProjDropdownOpen, setIsProjDropdownOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState("deji-default-org");
    const [selectedProject, setSelectedProject] = useState("default-project");

    // Real API keys state
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
    const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
    const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [allActivities, setAllActivities] = useState<ActivityEvent[]>([]);
    const [isActivityLoading, setIsActivityLoading] = useState(false);
    
    // Playground state
    const [playgroundMemories, setPlaygroundMemories] = useState(INITIAL_PLAYGROUND_MEMORIES);
    const [playIngestText, setPlayIngestText] = useState("");
    const [playIngestStatus, setPlayIngestStatus] = useState<string | null>(null);
    const [playQueryText, setPlayQueryText] = useState("");
    const [playgroundResults, setPlaygroundResults] = useState<any[]>(INITIAL_PLAYGROUND_MEMORIES);

    // Install guide tab state
    const [installLang, setInstallLang] = useState<"curl" | "python" | "node">("curl");

    // Logs explorer states
    const [requestLogs, setRequestLogs] = useState(INITIAL_REQUEST_LOGS);
    const [logSearchQuery, setLogSearchQuery] = useState("");
    const [logStatusFilter, setLogStatusFilter] = useState("all");
    const [selectedLogDetail, setSelectedLogDetail] = useState<any | null>(null);

    // Entities states
    const [entities, setEntities] = useState(INITIAL_ENTITIES);
    const [entitySearchQuery, setEntitySearchQuery] = useState("");

    // Webhooks states
    const [webhookUrl, setWebhookUrl] = useState("https://api.mycompany.com/webhook");
    const [webhookLogs, setWebhookLogs] = useState(INITIAL_WEBHOOK_LOGS);
    const [isSendingWebhook, setIsSendingWebhook] = useState(false);
    const [selectedWebhookLog, setSelectedWebhookLog] = useState<any | null>(null);
    const [webhookEvents, setWebhookEvents] = useState({
        created: true,
        updated: true,
        deleted: false,
        extracted: true
    });

    // Exports states
    const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");
    const [exportRange, setExportRange] = useState("all");
    const [exportProgress, setExportProgress] = useState<number | null>(null);
    const [exportReadyLink, setExportReadyLink] = useState<string | null>(null);

    // Settings states
    const [orgNameInput, setOrgNameInput] = useState("deji-default-org");
    const [llmProvider, setLlmProvider] = useState("openai");
    const [confidenceThreshold, setConfidenceThreshold] = useState(0.70);
    const [consolidationEnabled, setConsolidationEnabled] = useState(true);
    const [settingsSaveStatus, setSettingsSaveStatus] = useState(false);

    // Upgrades modal state
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [upgradeLoading, setUpgradeLoading] = useState(false);

    const router = useRouter();
    const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';

    useEffect(() => {
        fetchKeys();
    }, []);

    // Sync mock events stream to make it feel alive
    useEffect(() => {
        const interval = setInterval(() => {
            // Append a simulated request log
            const endpoints = ["/v1/memories/search", "/v1/memories/add", "/v1/entities", "/v1/memories/delete"];
            const methods = ["GET", "POST", "GET", "DELETE"];
            const keyNames = ["crawler-agent-prod", "ingest-worker-01", "default-key"];
            const randomIndex = Math.floor(Math.random() * endpoints.length);
            const randomStatus = Math.random() > 0.08 ? 200 : 500;
            const newLog = {
                id: `req_${Math.random().toString(36).substr(2, 5)}`,
                timestamp: Date.now(),
                method: methods[randomIndex],
                endpoint: endpoints[randomIndex],
                status: randomStatus,
                latency: `${Math.floor(Math.random() * 80) + 10}ms`,
                keyName: keyNames[Math.floor(Math.random() * keyNames.length)]
            };
            setRequestLogs(prev => [newLog, ...prev.slice(0, 19)]);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const fetchKeys = async () => {
        try {
            const url = isBypass ? '/api/v1/agents/keys?agent_bypass=true' : '/api/v1/agents/keys';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                const parsedKeys = data.map((keyString: string) => typeof keyString === 'string' ? JSON.parse(keyString) : keyString);
                setKeys(parsedKeys);
                
                // Fetch activity for all keys to populate global activity
                fetchAllActivities(parsedKeys);
            }
        } catch (error) {
            console.error("Failed to fetch keys", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllActivities = async (agentKeys: ApiKey[]) => {
        setIsActivityLoading(true);
        try {
            const activitiesPromises = agentKeys.map(async (key) => {
                const rawKey = key.id.replace('apikey:', '');
                const url = isBypass 
                    ? `/api/v1/agents/keys/activity?agent_bypass=true&key=${rawKey}` 
                    : `/api/v1/agents/keys/activity?key=${rawKey}`;
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    return data.map((a: any) => ({ ...a, agent: key.name }));
                }
                return [];
            });

            // Fetch user Clerk files (human uploads)
            const userFilesPromise = (async () => {
                try {
                    const res = await fetch('/api/user/files');
                    if (res.ok) {
                        const data = await res.json();
                        const files = data.files || [];
                        return files.map((file: any) => {
                            const ts = file.uploadedAt || (file.createdAt ? new Date(file.createdAt).getTime() : Date.now());
                            return {
                                id: file.id,
                                type: file.contentType ? "FILE_UPLOADED" : "CLIP_CREATED",
                                timestamp: ts,
                                preview: file.abstract || file.overview || "No preview available.",
                                metadata: {
                                    title: file.filename || file.title || "Unnamed Artifact",
                                    filename: file.filename || file.title || "Unnamed Artifact",
                                    contentType: file.contentType || "text/plain",
                                    sizeBytes: file.size || file.sizeBytes || 0,
                                    agentName: file.agentName || "Human / Web App",
                                    expiresAt: ts + 86400 * 1000
                                },
                                agent: file.agentName || "Human / Web App"
                            };
                        });
                    }
                } catch (e) {
                    console.error("Failed to fetch user files", e);
                }
                return [];
            })();

            const [agentResults, userFiles] = await Promise.all([
                Promise.all(activitiesPromises),
                userFilesPromise
            ]);

            const flatActivities = [...agentResults.flat(), ...userFiles].sort((a, b) => b.timestamp - a.timestamp);
            setAllActivities(flatActivities);
        } catch (error) {
            console.error("Failed to fetch all activities", error);
        } finally {
            setIsActivityLoading(false);
        }
    };

    const handleGenerateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim()) return;

        setIsGenerating(true);
        try {
            const url = isBypass ? '/api/v1/agents/keys?agent_bypass=true' : '/api/v1/agents/keys';
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName })
            });

            if (res.ok) {
                setNewKeyName("");
                fetchKeys();
            }
        } catch (error) {
            console.error("Failed to generate key", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDeleteKey = async (apiKey: string) => {
        setIsDeleting(true);
        try {
            const baseUrl = isBypass ? '/api/v1/agents/keys?agent_bypass=true&key=' : '/api/v1/agents/keys?key=';
            const res = await fetch(`${baseUrl}${apiKey}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setKeyToDelete(null);
                fetchKeys();
            }
        } catch (error) {
            console.error("Failed to delete key", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCopy = (key: string, id: string) => {
        navigator.clipboard.writeText(key);
        setCopiedKeyId(id);
        setTimeout(() => setCopiedKeyId(null), 2000);
    };

    const toggleKeyVisibility = (id: string) => {
        setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSyncSubscription = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('/api/user/sync-subscription', { method: 'POST' });
            if (res.ok) {
                router.refresh();
                window.location.reload();
            }
        } catch (error) {
            console.error("Failed to sync subscription", error);
        } finally {
            setIsSyncing(false);
        }
    };

    // Ingest memory in playground
    const handlePlaygroundIngest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!playIngestText.trim()) return;

        setPlayIngestStatus("ingesting");
        setTimeout(() => {
            const newMem = {
                id: `mem_${Math.random().toString(36).substr(2, 5)}`,
                text: playIngestText,
                timestamp: Date.now(),
                confidence: 0.90 + Math.random() * 0.09
            };
            setPlaygroundMemories(prev => [newMem, ...prev]);
            setPlaygroundResults(prev => [newMem, ...prev]);
            
            // Extract some entities mocks
            const textLower = playIngestText.toLowerCase();
            const extracted = [];
            if (textLower.includes("google")) extracted.push({ name: "Google", type: "Organization" });
            if (textLower.includes("python")) extracted.push({ name: "Python", type: "Language" });
            if (textLower.includes("seattle")) extracted.push({ name: "Seattle", type: "Location" });
            if (textLower.includes("vscode") || textLower.includes("vs code")) extracted.push({ name: "VS Code", type: "IDE" });
            
            extracted.forEach(ent => {
                const exists = entities.find(e => e.name.toLowerCase() === ent.name.toLowerCase());
                if (exists) {
                    setEntities(prev => prev.map(e => e.id === exists.id ? { ...e, references: e.references + 1, lastUpdated: Date.now() } : e));
                } else {
                    setEntities(prev => [{ id: `ent_${Math.random()}`, name: ent.name, type: ent.type, references: 1, lastUpdated: Date.now() }, ...prev]);
                }
            });

            setPlayIngestStatus("success");
            setPlayIngestText("");
            setTimeout(() => setPlayIngestStatus(null), 3000);
        }, 1000);
    };

    // Query memories in playground
    const handlePlaygroundQuery = (e: React.FormEvent) => {
        e.preventDefault();
        if (!playQueryText.trim()) {
            setPlaygroundResults(playgroundMemories);
            return;
        }

        const queryLower = playQueryText.toLowerCase();
        // Simple search matching keywords
        const filtered = playgroundMemories.map(mem => {
            const memLower = mem.text.toLowerCase();
            let score = 0.2;
            const queryWords = queryLower.split(/\s+/);
            const matches = queryWords.filter(word => word.length > 2 && memLower.includes(word));
            
            if (matches.length > 0) {
                score = 0.5 + (matches.length / queryWords.length) * 0.49;
            }
            return { ...mem, confidence: parseFloat(score.toFixed(2)) };
        }).filter(m => m.confidence > 0.35).sort((a, b) => b.confidence - a.confidence);

        setPlaygroundResults(filtered);
    };

    // Trigger test webhook
    const handleSendTestWebhook = () => {
        setIsSendingWebhook(true);
        setTimeout(() => {
            const whEvents = ["memory.created", "entity.extracted"];
            const selectedEvent = whEvents[Math.floor(Math.random() * whEvents.length)];
            const isSuccess = Math.random() > 0.15;
            
            const newLog = {
                id: `wh_${Math.random().toString(36).substr(2, 5)}`,
                timestamp: Date.now(),
                event: selectedEvent,
                status: isSuccess ? 200 : 500,
                latency: `${Math.floor(Math.random() * 120) + 40}ms`,
                payload: selectedEvent === "memory.created" ? `{\n  "event": "memory.created",\n  "id": "mem_${Math.random().toString(36).substr(2, 5)}",\n  "text": "User wants to learn Rust during the weekend"\n}` : `{\n  "event": "entity.extracted",\n  "entity": "Rust",\n  "type": "Language"\n}`
            };

            setWebhookLogs(prev => [newLog, ...prev]);
            setIsSendingWebhook(false);
        }, 800);
    };

    // Trigger download / export data
    const handleStartExport = () => {
        setExportProgress(0);
        setExportReadyLink(null);
        
        const interval = setInterval(() => {
            setExportProgress(prev => {
                if (prev === null) return 0;
                if (prev >= 100) {
                    clearInterval(interval);
                    setExportReadyLink(`driveio_export_${selectedProject}_2026.${exportFormat}`);
                    return 100;
                }
                return prev + 20;
            });
        }, 300);
    };

    // Save workspace settings
    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setSelectedOrg(orgNameInput);
        setSettingsSaveStatus(true);
        setTimeout(() => setSettingsSaveStatus(false), 2500);
    };

    // Stripe checkout upgrade simulation
    const handleUpgradeSubmit = () => {
        setUpgradeLoading(true);
        setTimeout(() => {
            setUpgradeLoading(false);
            setPlan("developer");
            setIsUpgradeModalOpen(false);
            // Flash success notification
            alert("Upgrade Successful! You are now subscribed to the Developer Plan ($25/mo).");
        }, 1500);
    };

    // Aggregate stats calculation
    const stats = useMemo(() => {
        const totalKeys = keys.length;
        const totalMemories = playgroundMemories.length + 151; // baseline + playground added
        const totalReqs = requestLogs.length + 243;
        const totalEntities = entities.length;
        return { totalKeys, totalMemories, totalReqs, totalEntities };
    }, [keys, playgroundMemories, requestLogs, entities]);

    // Chart mock data
    const requestChartData = useMemo(() => {
        return [
            { time: "08:00", requests: 34, latency: 28 },
            { time: "10:00", requests: 45, latency: 31 },
            { time: "12:00", requests: 89, latency: 35 },
            { time: "14:00", requests: 120, latency: 42 },
            { time: "16:00", requests: 75, latency: 32 },
            { time: "18:00", requests: 52, latency: 30 },
            { time: "20:00", requests: 68, latency: 29 },
            { time: "22:00", requests: 41, latency: 27 },
        ];
    }, []);

    const entityChartData = useMemo(() => {
        return [
            { date: "May 18", entities: 8 },
            { date: "May 19", entities: 12 },
            { date: "May 20", entities: 5 },
            { date: "May 21", entities: 14 },
            { date: "May 22", entities: 19 },
        ];
    }, []);

    // Filter logs explorer items
    const filteredLogs = useMemo(() => {
        return requestLogs.filter(log => {
            const matchesSearch = logSearchQuery === "" || 
                log.endpoint.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                log.keyName.toLowerCase().includes(logSearchQuery.toLowerCase());
            
            const matchesStatus = logStatusFilter === "all" || 
                (logStatusFilter === "200" && log.status === 200) ||
                (logStatusFilter === "500" && log.status === 500);

            return matchesSearch && matchesStatus;
        });
    }, [requestLogs, logSearchQuery, logStatusFilter]);

    // Filter entities items
    const filteredEntities = useMemo(() => {
        return entities.filter(ent => 
            entitySearchQuery === "" || 
            ent.name.toLowerCase().includes(entitySearchQuery.toLowerCase()) ||
            ent.type.toLowerCase().includes(entitySearchQuery.toLowerCase())
        );
    }, [entities, entitySearchQuery]);

    // Plan limits calculations
    const planLimits = useMemo(() => {
        const isDev = plan === "developer";
        return {
            addLimit: isDev ? 100000 : 10000,
            addCount: stats.totalMemories - 120 + 230, // simulated
            retLimit: isDev ? 50000 : 1000,
            retCount: stats.totalReqs - 200 + 120, // simulated
        };
    }, [plan, stats]);

    const navigationGroups = [
        {
            title: "SETUP",
            items: [
                { id: "install", label: "Install guide", icon: BookOpen },
                { id: "playground", label: "Playground", icon: PlayCircle },
                { id: "api-keys", label: "API Keys", icon: Key },
            ]
        },
        {
            title: "ACTIVITY",
            items: [
                { id: "overview", label: "Dashboard", icon: LayoutDashboard },
                { id: "requests", label: "Requests", icon: Clock },
                { id: "entities", label: "Entities", icon: Tag },
                { id: "artifacts", label: "Artifact Library", icon: FolderOpen },
                { id: "webhooks", label: "Webhooks", icon: Webhook },
                { id: "exports", label: "Memory Exports", icon: Download },
            ]
        },
        {
            title: "ACCOUNT",
            items: [
                { id: "settings", label: "Settings", icon: Settings },
                { id: "billing", label: "Usage & Billing", icon: CreditCard },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans selection:bg-blue-500/20 antialiased">
            
            {/* 1. Custom Dashboard Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#e2e8f0] z-50 flex items-center justify-between px-6 shadow-sm">
                
                {/* Brand Logo & Switchers */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight text-[#0f172a] hover:opacity-90 transition-opacity">
                        <div className="h-9 w-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                            <Cpu className="w-5 h-5 animate-pulse" />
                        </div>
                        <span className="hidden sm:inline-block font-sans lowercase">drive.io</span>
                    </div>

                    <div className="h-6 w-[1px] bg-slate-200 mx-3 hidden sm:block" />

                    {/* Workspace/Org Dropdown */}
                    <div className="relative hidden md:block">
                        <button 
                            onClick={() => { setIsOrgDropdownOpen(!isOrgDropdownOpen); setIsProjDropdownOpen(false); }}
                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg text-sm text-slate-700 font-medium transition-colors border border-slate-200/80 bg-slate-50/50"
                        >
                            <Globe className="w-4 h-4 text-blue-600" />
                            <span className="max-w-[120px] truncate">{selectedOrg}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        <AnimatePresence>
                            {isOrgDropdownOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50"
                                >
                                    <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Select Workspace</div>
                                    <button 
                                        onClick={() => { setSelectedOrg("deji-default-org"); setIsOrgDropdownOpen(false); }}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                                    >
                                        <span>deji-default-org</span>
                                        {selectedOrg === "deji-default-org" && <Check className="w-4 h-4 text-blue-600" />}
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedOrg("production-fleet-org"); setIsOrgDropdownOpen(false); }}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                                    >
                                        <span>production-fleet-org</span>
                                        {selectedOrg === "production-fleet-org" && <Check className="w-4 h-4 text-blue-600" />}
                                    </button>
                                    <div className="border-t border-slate-100 my-1" />
                                    <button className="w-full text-left px-3 py-2 text-xs text-blue-600 hover:bg-blue-50/50 font-bold rounded-lg">+ Create organization</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Project Dropdown */}
                    <div className="relative hidden md:block">
                        <button 
                            onClick={() => { setIsProjDropdownOpen(!isProjDropdownOpen); setIsOrgDropdownOpen(false); }}
                            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-lg text-sm text-slate-700 font-medium transition-colors border border-slate-200/80 bg-slate-50/50"
                        >
                            <Database className="w-4 h-4 text-indigo-600" />
                            <span className="max-w-[120px] truncate">{selectedProject}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        <AnimatePresence>
                            {isProjDropdownOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50"
                                >
                                    <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Select Project</div>
                                    <button 
                                        onClick={() => { setSelectedProject("default-project"); setIsProjDropdownOpen(false); }}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                                    >
                                        <span>default-project</span>
                                        {selectedProject === "default-project" && <Check className="w-4 h-4 text-indigo-600" />}
                                    </button>
                                    <button 
                                        onClick={() => { setSelectedProject("marketing-agents"); setIsProjDropdownOpen(false); }}
                                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                                    >
                                        <span>marketing-agents</span>
                                        {selectedProject === "marketing-agents" && <Check className="w-4 h-4 text-indigo-600" />}
                                    </button>
                                    <div className="border-t border-slate-100 my-1" />
                                    <button className="w-full text-left px-3 py-2 text-xs text-indigo-600 hover:bg-indigo-50/50 font-bold rounded-lg">+ Create project</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Utility Buttons */}
                <div className="flex items-center gap-4">
                    {/* Pro Tier Badge */}
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-black text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-full shadow-sm tracking-wider uppercase">
                        <Sparkle className="w-3.5 h-3.5 animate-spin" />
                        {plan === "developer" ? "Pro Developer" : "Hobby Tier"}
                    </span>

                    {/* Docs Link */}
                    <a 
                        href="/docs" 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                    >
                        <span>Docs</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {/* Upgrade Button */}
                    {plan !== "developer" && (
                        <button 
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                            <span>Upgrade</span>
                        </button>
                    )}

                    {/* Clerk User Button */}
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-9 h-9 border border-slate-200 hover:scale-105 transition-transform"
                            }
                        }}
                    />
                </div>
            </header>

            {/* Layout Wrapper */}
            <div className="flex-1 flex pt-16">
                
                {/* 2. Left Navigation Sidebar */}
                <aside 
                    className={`fixed left-0 top-16 bottom-0 z-40 bg-white border-r border-[#e2e8f0] flex flex-col transition-all duration-300 shadow-sm ${
                        isSidebarCollapsed ? 'w-16' : 'w-64'
                    } hidden md:flex`}
                >
                    {/* Navigation Groups */}
                    <div className="flex-1 py-6 px-3 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                        {navigationGroups.map((group, idx) => (
                            <div key={idx} className="flex flex-col gap-1.5">
                                {!isSidebarCollapsed && (
                                    <span className="px-3 text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">
                                        {group.title}
                                    </span>
                                )}
                                <div className="space-y-0.5">
                                    {group.items.map((item) => {
                                        const isActive = activeTab === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => setActiveTab(item.id)}
                                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
                                                    isActive 
                                                        ? 'bg-blue-50/80 text-blue-700' 
                                                        : 'text-slate-600 hover:text-[#0f172a] hover:bg-slate-50'
                                                } ${isSidebarCollapsed ? 'justify-center' : 'justify-start'}`}
                                                title={isSidebarCollapsed ? item.label : undefined}
                                            >
                                                <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                                {!isSidebarCollapsed && <span>{item.label}</span>}
                                                
                                                {/* Left Accent indicator for active item */}
                                                {isActive && !isSidebarCollapsed && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Hobby plan limits & sidebar toggles */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                        {!isSidebarCollapsed && (
                            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                                    <span>Hobby Plan usage</span>
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 capitalize">{plan}</span>
                                </div>
                                <div className="space-y-2.5">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                                            <span>Add Events</span>
                                            <span>{planLimits.addCount.toLocaleString()} / {planLimits.addLimit.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                                                style={{ width: `${Math.min(100, (planLimits.addCount / planLimits.addLimit) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-600 font-medium mb-1">
                                            <span>Retrieval Events</span>
                                            <span>{planLimits.retCount.toLocaleString()} / {planLimits.retLimit.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                                                style={{ width: `${Math.min(100, (planLimits.retCount / planLimits.retLimit) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="w-full flex items-center justify-center p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors border border-slate-200"
                        >
                            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                        </button>
                    </div>
                </aside>

                {/* 3. Main Content Area */}
                <main className={`flex-1 min-h-[calc(100vh-64px)] transition-all duration-300 p-6 md:p-8 lg:p-10 bg-[#f8fafc] ${
                    isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
                }`}>
                    <div className="max-w-6xl mx-auto flex flex-col gap-8">
                        
                        {/* Mobile Menu Toggle (Visible only on small screens) */}
                        <div className="md:hidden flex items-center justify-between pb-4 border-b border-slate-200">
                            <h1 className="text-lg font-black text-slate-900 capitalize tracking-tight flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                                {activeTab.replace('-', ' ')}
                            </h1>
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-800"
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Mobile Dropdown Menu */}
                        <AnimatePresence>
                            {isMobileMenuOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="md:hidden overflow-hidden border border-slate-200 rounded-xl bg-white p-2 shadow-lg"
                                >
                                    <div className="flex flex-col gap-1">
                                        {navigationGroups.flatMap(g => g.items).map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                                                className={`flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-colors ${
                                                    activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                <item.icon className="w-4 h-4" />
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main Render Views */}
                        <AnimatePresence mode="wait">
                            
                            {/* TAB: DASHBOARD OVERVIEW */}
                            {activeTab === 'overview' && (
                                <motion.div 
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-col gap-8"
                                >
                                    {/* Subtitle & Date range selector */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
                                            <p className="text-slate-500 mt-1">Review knowledge sync volume and API response times.</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-xs self-start">
                                            {["24h", "7d", "30d"].map((range) => (
                                                <button 
                                                    key={range} 
                                                    className="px-3 py-1 text-xs font-bold rounded-md hover:bg-slate-50 text-slate-600 active:bg-slate-100 transition-colors"
                                                >
                                                    Last {range}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {[
                                            { label: 'Total Memories Stored', value: stats.totalMemories.toLocaleString(), sub: '+12.4% vs last week', color: 'blue', icon: Brain },
                                            { label: 'Retrieval API Usage', value: '4.5%', sub: `${planLimits.retCount} / ${planLimits.retLimit} events`, color: 'indigo', icon: Database },
                                            { label: 'Total API Requests', value: stats.totalReqs.toLocaleString(), sub: 'Read/Write events', color: 'emerald', icon: BarChart3 },
                                            { label: 'Active Agent Keys', value: stats.totalKeys.toString(), sub: 'Clusters deployed', color: 'orange', icon: Key }
                                        ].map((stat, i) => (
                                            <div key={i} className="p-6 bg-white border border-slate-200/80 rounded-xl relative overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
                                                <div className={`absolute top-0 left-0 w-1.5 h-full bg-${stat.color}-600`} />
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                                    <stat.icon className={`w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors`} />
                                                </div>
                                                <div className="text-3xl font-black text-slate-900 tracking-tight mb-1.5">{stat.value}</div>
                                                <div className="text-xs text-slate-500 font-semibold">{stat.sub}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Recharts Activity Grid */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Requests chart */}
                                        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                                            <div className="mb-6">
                                                <h3 className="font-black text-[#0f172a] text-base">API Requests Volume</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">Total requests & query latencies</p>
                                            </div>
                                            <div className="h-[250px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={requestChartData}>
                                                        <defs>
                                                            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                                                        <Area type="monotone" dataKey="requests" stroke="#2563eb" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={2} />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Entities chart */}
                                        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                                            <div className="mb-6">
                                                <h3 className="font-black text-[#0f172a] text-base">Extracted Entities</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">Entities consolidated per day</p>
                                            </div>
                                            <div className="h-[250px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={entityChartData}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                        <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                                                        <Bar dataKey="entities" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Explore Platform Grid */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                                        <h3 className="font-black text-[#0f172a] text-base mb-4">Explore the Platform</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {[
                                                { title: 'Integrate SDK', desc: 'Read the setup guide to link agents.', tab: 'install' },
                                                { title: 'Sandbox Playground', desc: 'Test query memory extraction.', tab: 'playground' },
                                                { title: 'Manage API Keys', desc: 'Provision/revoke access keys.', tab: 'api-keys' },
                                                { title: 'Streaming Webhooks', desc: 'Configure instant event delivery.', tab: 'webhooks' }
                                            ].map((explore, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setActiveTab(explore.tab)}
                                                    className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 hover:border-slate-300 rounded-xl text-left transition-all group"
                                                >
                                                    <div className="font-black text-sm text-[#0f172a] mb-1 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                                                        <span>{explore.title}</span>
                                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0 text-blue-600" />
                                                    </div>
                                                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{explore.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB: PLAYGROUND */}
                            {activeTab === 'playground' && (
                                <motion.div 
                                    key="playground"
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    className="flex flex-col gap-6"
                                >
                                    <div>
                                        <h1 className="text-3xl font-black tracking-tight text-slate-900">Sandbox Playground</h1>
                                        <p className="text-slate-500 mt-1">Directly query, search, and ingest semantic logs into your memory graph.</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        
                                        {/* Ingest panel */}
                                        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col gap-4">
                                            <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Plus className="w-4 h-4 text-blue-600" />
                                                Ingest Memory Block
                                            </h3>
                                            <form onSubmit={handlePlaygroundIngest} className="flex flex-col gap-4 flex-1">
                                                <textarea 
                                                    value={playIngestText}
                                                    onChange={(e) => setPlayIngestText(e.target.value)}
                                                    placeholder="e.g. User is a senior developer working remotely from New York. They prefer TypeScript for backend projects and utilize vim keybindings."
                                                    className="w-full bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-600 transition-colors placeholder:text-slate-400 font-sans min-h-[140px] resize-none leading-relaxed font-semibold"
                                                    required
                                                />
                                                {playIngestStatus === "success" && (
                                                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-bold flex items-center gap-2">
                                                        <Check className="w-4 h-4" />
                                                        Memory ingested successfully! Extracted entity tags: &quot;New York&quot;, &quot;TypeScript&quot;, &quot;Vim&quot;.
                                                    </div>
                                                )}
                                                <button 
                                                    type="submit" 
                                                    disabled={playIngestStatus === "ingesting" || !playIngestText.trim()}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md shadow-blue-500/10 flex justify-center items-center gap-2 disabled:opacity-50"
                                                >
                                                    {playIngestStatus === "ingesting" ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Save Memory"}
                                                </button>
                                            </form>
                                        </div>

                                        {/* Search query panel */}
                                        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col gap-4">
                                            <h3 className="font-black text-sm text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Search className="w-4 h-4 text-indigo-600" />
                                                Semantic Query & Retrieve
                                            </h3>
                                            <form onSubmit={handlePlaygroundQuery} className="flex gap-2">
                                                <input 
                                                    type="text"
                                                    value={playQueryText}
                                                    onChange={(e) => setPlayQueryText(e.target.value)}
                                                    placeholder="e.g. What programming language does the user use?"
                                                    className="flex-1 bg-slate-50 hover:bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-600 transition-colors font-semibold"
                                                />
                                                <button 
                                                    type="submit"
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-md shadow-indigo-500/10 flex items-center gap-1.5"
                                                >
                                                    <Send className="w-3.5 h-3.5" />
                                                    <span>Search</span>
                                                </button>
                                            </form>

                                            {/* Search results database */}
                                            <div className="flex-1 flex flex-col gap-3 min-h-[160px] max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Similarity matches</div>
                                                {playgroundResults.length === 0 ? (
                                                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400">
                                                        <Search className="w-8 h-8 mb-2 stroke-1" />
                                                        <span className="text-xs font-bold">No matching memories. Try adding one on the left!</span>
                                                    </div>
                                                ) : (
                                                    playgroundResults.map((res, i) => (
                                                        <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1.5">
                                                            <p className="text-sm font-semibold text-slate-800 leading-relaxed">&quot;{res.text}&quot;</p>
                                                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                                                <span>Id: {res.id}</span>
                                                                <div className="flex items-center gap-1">
                                                                    <span>Confidence:</span>
                                                                    <span className="font-bold text-indigo-600 px-1 bg-indigo-50 border border-indigo-100 rounded">{res.confidence * 100}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB: API KEYS */}
                            {activeTab === 'api-keys' && (
                                <motion.div 
                                    key="api-keys"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                                >
                                    {/* Key Provision Card */}
                                    <div className="lg:col-span-1 flex flex-col gap-6">
                                        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs">
                                            <h2 className="text-lg font-black text-[#0f172a] mb-4 flex items-center gap-2">
                                                <Plus className="w-5 h-5 text-blue-600" />
                                                Provision Key
                                            </h2>
                                            <form onSubmit={handleGenerateKey} className="flex flex-col gap-4">
                                                <div>
                                                    <label className="block text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2">Agent Name Identifier</label>
                                                    <input
                                                        type="text"
                                                        value={newKeyName}
                                                        onChange={(e) => setNewKeyName(e.target.value)}
                                                        placeholder="e.g. ingest-worker-prod"
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-[#0f172a] focus:outline-none focus:border-blue-600 transition-colors font-semibold"
                                                        required
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={isGenerating || !newKeyName.trim()}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-md shadow-blue-500/10"
                                                >
                                                    {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Deploy Agent Key"}
                                                </button>
                                            </form>
                                        </div>

                                        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
                                            <h4 className="text-blue-700 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Shield className="w-4 h-4" />
                                                Key Security
                                            </h4>
                                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                                                Your API keys carry full read and write permissions to the edge. Never publish them in client-side code or public repositories.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Key list card */}
                                    <div className="lg:col-span-2 flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-black text-[#0f172a] flex items-center gap-2">
                                                <Key className="w-5 h-5 text-slate-500" />
                                                Active Clusters ({keys.length})
                                            </h2>
                                            {isSyncing ? (
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Syncing...
                                                </span>
                                            ) : (
                                                <button 
                                                    onClick={handleSyncSubscription} 
                                                    className="text-[10px] font-bold text-blue-600 hover:underline"
                                                >
                                                    Sync settings
                                                </button>
                                            )}
                                        </div>

                                        {isLoading ? (
                                            <div className="p-16 border border-dashed border-slate-200 rounded-xl bg-white text-center text-slate-400 flex flex-col items-center justify-center gap-4">
                                                <RefreshCw className="w-8 h-8 animate-spin text-slate-300" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Scanning Cluster Keys...</span>
                                            </div>
                                        ) : keys.length === 0 ? (
                                            <div className="p-16 border border-dashed border-slate-200 rounded-xl bg-white text-center flex flex-col items-center justify-center">
                                                <Key className="w-12 h-12 text-slate-200 mb-4" />
                                                <h3 className="text-slate-700 font-bold mb-1">No API keys found</h3>
                                                <p className="text-xs text-slate-400 max-w-xs font-semibold leading-relaxed">Provision a new credentials key on the left to authorize your LLM agent flows.</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3">
                                                {keys.map((key) => {
                                                    const rawKey = key.id.replace('apikey:', '');
                                                    const isRevealed = revealedKeys[key.id];
                                                    const maskedKey = `do_${'*'.repeat(24)}`;
                                                    
                                                    return (
                                                        <div 
                                                            key={key.id}
                                                            className="p-5 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/20 hover:shadow-sm transition-all"
                                                        >
                                                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                                                <div className="flex items-center gap-2.5">
                                                                    <span className="font-bold text-[#0f172a] text-sm truncate">{key.name}</span>
                                                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold uppercase tracking-wider">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                        Active
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1 max-w-md">
                                                                    <code className="text-slate-600 text-xs font-mono truncate pl-3 flex-1">
                                                                        {isRevealed ? rawKey : maskedKey}
                                                                    </code>
                                                                    <div className="flex items-center border-l border-slate-200 ml-2 pl-1.5">
                                                                        <button 
                                                                            onClick={() => toggleKeyVisibility(key.id)}
                                                                            className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                                                                        >
                                                                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleCopy(rawKey, key.id)}
                                                                            className="p-2 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition-colors"
                                                                        >
                                                                            {copiedKeyId === key.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                                                                    <span>Created: {new Date(key.createdAt).toLocaleDateString()}</span>
                                                                    <span>•</span>
                                                                    <span>Key ID: {key.id.substring(0, 8)}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-6 sm:border-l sm:border-slate-100 sm:pl-6 self-start sm:self-center">
                                                                <div className="text-left sm:text-right">
                                                                    <div className="text-xl font-black text-slate-900 leading-none">{key.usage || 0}</div>
                                                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Total Hits</span>
                                                                </div>
                                                                <button 
                                                                    onClick={() => setKeyToDelete(rawKey)}
                                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB: INSTALL GUIDE */}
                            {activeTab === 'install' && (
                                <motion.div 
                                    key="install"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col gap-6"
                                >
                                    <div>
                                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Quickstart Guide</h1>
                                        <p className="text-slate-500 mt-0.5">Integrate the Drive.io agent memory client in less than 3 minutes.</p>
                                    </div>

                                    {/* Selector languages */}
                                    <div className="flex gap-2 border-b border-slate-100 pb-3">
                                        {[
                                            { id: 'curl', label: 'cURL API' },
                                            { id: 'python', label: 'Python SDK' },
                                            { id: 'node', label: 'Node.js' }
                                        ].map((lang) => (
                                            <button
                                                key={lang.id}
                                                onClick={() => setInstallLang(lang.id as any)}
                                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
                                                    installLang === lang.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                {lang.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Lang Snippets */}
                                    <div className="relative">
                                        <pre className="p-4 bg-slate-950 text-slate-100 text-xs font-mono rounded-lg overflow-x-auto whitespace-pre leading-relaxed">
                                            {installLang === 'curl' && `curl -X POST "https://api.drive.io/v1/memories" \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "userId": "user_123",
    "text": "User is a python developer who works on macOS"
  }'`}
                                            {installLang === 'python' && `pip install driveio

from driveio import DriveIO

drive = DriveIO(api_key="your_api_key")

# Ingest memory
drive.memories.add(
    user_id="user_123",
    text="User is a python developer who works on macOS"
)

# Search memories
results = drive.memories.search(
    user_id="user_123",
    query="What OS does the user run?"
)
print(results)`}
                                            {installLang === 'node' && `npm install driveio

import { DriveIO } from 'driveio';

const drive = new DriveIO({ apiKey: 'your_api_key' });

// Ingest memory
await drive.memories.add({
  userId: 'user_123',
  text: 'User is a python developer who works on macOS'
});

// Search memories
const results = await drive.memories.search({
  userId: 'user_123',
  query: 'What OS does the user run?'
});
console.log(results);`}
                                        </pre>
                                        
                                        <button 
                                            onClick={() => {
                                                const text = installLang === 'curl' 
                                                    ? 'curl -X POST "https://api.drive.io/v1/memories" ...' 
                                                    : installLang === 'python' 
                                                    ? 'from driveio import DriveIO ...' 
                                                    : 'import { DriveIO } from \'driveio\' ...';
                                                navigator.clipboard.writeText(text);
                                                alert("Snippet summary copied to clipboard!");
                                            }}
                                            className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded transition-colors"
                                            title="Copy Code"
                                        >
                                            <Copy className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB: REQUESTS */}
                            {activeTab === 'requests' && (
                                <motion.div 
                                    key="requests"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col gap-6"
                                >
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">API Request Logs</h1>
                                        <p className="text-slate-500 mt-1">Real-time HTTP requests dispatched to the memory L0 edge database.</p>
                                    </div>

                                    {/* Filters logs */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
                                        <div className="relative w-full sm:w-80">
                                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type="text"
                                                value={logSearchQuery}
                                                onChange={(e) => setLogSearchQuery(e.target.value)}
                                                placeholder="Search by endpoint, key name..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-600 transition-colors font-semibold"
                                            />
                                        </div>
                                        <select 
                                            value={logStatusFilter}
                                            onChange={(e) => setLogStatusFilter(e.target.value)}
                                            className="w-full sm:w-44 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none cursor-pointer font-bold text-slate-600"
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="200">200 OK</option>
                                            <option value="500">500 Server Error</option>
                                        </select>
                                    </div>

                                    {/* Logs Table */}
                                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-slate-50/80 border-b border-slate-200">
                                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Endpoint</th>
                                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Latency</th>
                                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">API Key</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {filteredLogs.map((log) => (
                                                        <tr 
                                                            key={log.id} 
                                                            onClick={() => setSelectedLogDetail(log)}
                                                            className="hover:bg-slate-50/65 cursor-pointer transition-colors"
                                                        >
                                                            <td className="px-6 py-4 text-xs font-mono text-slate-500">
                                                                {new Date(log.timestamp).toLocaleTimeString()}
                                                            </td>
                                                            <td className="px-6 py-4 text-xs">
                                                                <span className={`px-2 py-0.5 rounded font-black text-[9px] ${
                                                                    log.method === 'POST' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                                                }`}>
                                                                    {log.method}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-xs font-mono font-bold text-slate-800">
                                                                {log.endpoint}
                                                            </td>
                                                            <td className="px-6 py-4 text-xs">
                                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                                                    log.status === 200 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                                                }`}>
                                                                    {log.status === 200 ? '200 OK' : '500 ERR'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-xs font-mono font-semibold text-slate-600">{log.latency}</td>
                                                            <td className="px-6 py-4 text-xs font-mono text-slate-400">{log.keyName}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB: ENTITIES */}
                            {activeTab === 'entities' && (
                                <motion.div 
                                    key="entities"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col gap-6"
                                >
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Extracted Entities</h1>
                                        <p className="text-slate-500 mt-1">Knowledge-graph entities parsed and consolidated automatically from your ingestion logs.</p>
                                    </div>

                                    {/* Entity search */}
                                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
                                        <div className="relative w-full sm:w-80">
                                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type="text"
                                                value={entitySearchQuery}
                                                onChange={(e) => setEntitySearchQuery(e.target.value)}
                                                placeholder="Search entities by name or class..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 transition-colors font-semibold"
                                            />
                                        </div>
                                    </div>

                                    {/* Grid of entities */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredEntities.map((ent) => (
                                            <div key={ent.id} className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between gap-3">
                                                <div>
                                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200/50 rounded text-[9px] font-black uppercase tracking-wider mb-2 inline-block">
                                                        {ent.type}
                                                    </span>
                                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{ent.name}</h3>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                                                    <span>Refs: <strong className="text-slate-700">{ent.references}</strong></span>
                                                    <span>Updated: {new Date(ent.lastUpdated).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB: ARTIFACT LIBRARY */}
                            {activeTab === 'artifacts' && (
                                <motion.div 
                                    key="artifacts"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    className="flex flex-col gap-6"
                                >
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Memory Artifact Registry</h1>
                                        <p className="text-slate-500 mt-1">Browse semantic clips, compiled files, and markdown layouts saved by active LLM loops.</p>
                                    </div>
                                    <ArtifactLibrary activities={allActivities} isLoading={isActivityLoading} />
                                </motion.div>
                            )}

                            {/* TAB: WEBHOOKS */}
                            {activeTab === 'webhooks' && (
                                <motion.div 
                                    key="webhooks"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                                >
                                    {/* Webhook endpoint card */}
                                    <div className="lg:col-span-1 flex flex-col gap-6">
                                        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col gap-4">
                                            <h3 className="font-black text-sm text-[#0f172a] uppercase tracking-wider flex items-center gap-1.5">
                                                <Webhook className="w-4.5 h-4.5 text-blue-600" />
                                                Webhook Settings
                                            </h3>
                                            <div className="flex flex-col gap-3">
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Destination URL</label>
                                                    <input 
                                                        type="url"
                                                        value={webhookUrl}
                                                        onChange={(e) => setWebhookUrl(e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600 transition-colors font-semibold"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subscribed Events</label>
                                                    <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                        {Object.keys(webhookEvents).map((ev) => (
                                                            <label key={ev} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                                                                <input 
                                                                    type="checkbox"
                                                                    checked={(webhookEvents as any)[ev]}
                                                                    onChange={(e) => setWebhookEvents(prev => ({ ...prev, [ev]: e.target.checked }))}
                                                                    className="rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                                                                />
                                                                <span>memory.{ev}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => alert("Webhook configuration saved successfully!")}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition-colors"
                                                >
                                                    Save Configuration
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-col gap-3">
                                            <h4 className="font-bold text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                                                <PlayCircle className="w-4 h-4" />
                                                Live Webhook Testing
                                            </h4>
                                            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                                                Trigger a simulated payload event directly to your destination endpoint to test message routing.
                                            </p>
                                            <button 
                                                onClick={handleSendTestWebhook}
                                                disabled={isSendingWebhook}
                                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg text-xs transition-colors flex justify-center items-center gap-1.5"
                                            >
                                                {isSendingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Send Test Webhook"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Webhook logs */}
                                    <div className="lg:col-span-2 flex flex-col gap-4">
                                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                            <Clock className="w-5 h-5 text-slate-400" />
                                            Webhook Delivery Logs
                                        </h3>
                                        
                                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                                            <table className="w-full text-left border-collapse text-xs">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-200">
                                                        <th className="px-5 py-3 font-black text-slate-400 uppercase tracking-widest">Time</th>
                                                        <th className="px-5 py-3 font-black text-slate-400 uppercase tracking-widest">Event Type</th>
                                                        <th className="px-5 py-3 font-black text-slate-400 uppercase tracking-widest">Status</th>
                                                        <th className="px-5 py-3 font-black text-slate-400 uppercase tracking-widest">Latency</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {webhookLogs.map((log) => (
                                                        <tr 
                                                            key={log.id} 
                                                            onClick={() => setSelectedWebhookLog(log)}
                                                            className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                                                        >
                                                            <td className="px-5 py-3.5 font-mono text-slate-500">
                                                                {new Date(log.timestamp).toLocaleTimeString()}
                                                            </td>
                                                            <td className="px-5 py-3.5 font-mono font-bold text-slate-800">
                                                                {log.event}
                                                            </td>
                                                            <td className="px-5 py-3.5">
                                                                <span className={`px-2 py-0.5 rounded font-black ${
                                                                    log.status === 200 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                                                }`}>
                                                                    {log.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3.5 font-mono text-slate-500">{log.latency}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB: MEMORY EXPORTS */}
                            {activeTab === 'exports' && (
                                <motion.div 
                                    key="exports"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col gap-6 max-w-xl"
                                >
                                    <div>
                                        <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Bulk Graph Export</h1>
                                        <p className="text-slate-500 mt-0.5">Export consolidated knowledge graph memories to local training files.</p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">File Format</label>
                                            <div className="flex gap-4">
                                                {['json', 'csv'].map((fmt) => (
                                                    <label key={fmt} className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                                                        <input 
                                                            type="radio"
                                                            checked={exportFormat === fmt}
                                                            onChange={() => setExportFormat(fmt as any)}
                                                            className="text-blue-600 border-slate-300 focus:ring-blue-500"
                                                        />
                                                        <span className="uppercase">{fmt} Format</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Scope Range</label>
                                            <select 
                                                value={exportRange}
                                                onChange={(e) => setExportRange(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none cursor-pointer font-bold text-slate-600"
                                            >
                                                <option value="all">All Memories (Full History)</option>
                                                <option value="30">Last 30 Days Only</option>
                                                <option value="7">Last 7 Days Only</option>
                                            </select>
                                        </div>

                                        <button 
                                            onClick={handleStartExport}
                                            disabled={exportProgress !== null && exportProgress < 100}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm shadow-md shadow-blue-500/10 flex justify-center items-center gap-1.5"
                                        >
                                            <DownloadCloud className="w-4 h-4" />
                                            <span>Start Export Compilation</span>
                                        </button>

                                        {exportProgress !== null && (
                                            <div className="flex flex-col gap-2 bg-slate-50 border border-slate-100 p-4 rounded-lg">
                                                <div className="flex justify-between text-xs font-bold text-slate-600">
                                                    <span>Exporting graph data...</span>
                                                    <span>{exportProgress}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                                        style={{ width: `${exportProgress}%` }}
                                                    />
                                                </div>
                                                {exportReadyLink && (
                                                    <div className="mt-2 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg flex items-center justify-between">
                                                        <span>Ready: {exportReadyLink}</span>
                                                        <button 
                                                            onClick={() => alert(`Simulated download of ${exportReadyLink}`)}
                                                            className="text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            Download
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* TAB: SETTINGS */}
                            {activeTab === 'settings' && (
                                <motion.div 
                                    key="settings"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-6 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col gap-6 max-w-xl"
                                >
                                    <div>
                                        <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">Workspace Configuration</h1>
                                        <p className="text-slate-500 mt-0.5">Control agent context filtering, default model providers, and semantic consolidation settings.</p>
                                    </div>

                                    <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Workspace Alias Name</label>
                                            <input 
                                                type="text"
                                                value={orgNameInput}
                                                onChange={(e) => setOrgNameInput(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-blue-600 transition-colors font-semibold"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Consolidation LLM Engine</label>
                                            <select 
                                                value={llmProvider}
                                                onChange={(e) => setLlmProvider(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:outline-none cursor-pointer font-bold text-slate-600"
                                            >
                                                <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                                                <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                                                <option value="google">Google (Gemini 1.5 Pro)</option>
                                                <option value="deepseek">DeepSeek (V3 Core)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Similarity Confidence Threshold</label>
                                                <span className="text-xs font-mono font-bold text-blue-600">{confidenceThreshold * 100}%</span>
                                            </div>
                                            <input 
                                                type="range"
                                                min="0.50"
                                                max="0.95"
                                                step="0.05"
                                                value={confidenceThreshold}
                                                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                                                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs font-bold text-slate-800">Autonomic Consolidation</span>
                                                <span className="text-[10px] text-slate-400 font-semibold">Consolidate overlapping logs automatically.</span>
                                            </div>
                                            <input 
                                                type="checkbox"
                                                checked={consolidationEnabled}
                                                onChange={(e) => setConsolidationEnabled(e.target.checked)}
                                                className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                            />
                                        </div>

                                        {settingsSaveStatus && (
                                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg flex items-center gap-1.5">
                                                <Check className="w-4 h-4" />
                                                Settings updated successfully!
                                            </div>
                                        )}

                                        <button 
                                            type="submit"
                                            className="w-full bg-[#0f172a] hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs transition-colors"
                                        >
                                            Save Settings
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* TAB: USAGE & BILLING */}
                            {activeTab === 'billing' && (
                                <motion.div 
                                    key="billing"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="flex flex-col gap-8"
                                >
                                    <div>
                                        <h1 className="text-3xl font-black text-slate-900 tracking-tight font-sans">Usage &amp; Billing</h1>
                                        <p className="text-slate-500 mt-1">Review your workspace quota limits and subscription pricing tiers.</p>
                                    </div>

                                    {/* Pricing card comparison */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { id: 'free', name: 'Hobby Tier', price: '$0', limitAdd: '10K events/mo', limitRet: '1K events/mo', support: 'Community Support', desc: 'Best for local testing and developer sandboxes.' },
                                            { id: 'developer', name: 'Developer Plan', price: '$25', limitAdd: '100K events/mo', limitRet: '50K events/mo', support: 'Priority email support', desc: 'Designed for production agents and scaling clusters.' },
                                            { id: 'production', name: 'Enterprise Core', price: 'Custom', limitAdd: 'Unlimited events', limitRet: 'Unlimited events', support: 'Dedicated SLA support', desc: 'Bespoke deployments with fully isolated server nodes.' }
                                        ].map((tier) => {
                                            const isCurrent = plan === tier.id;
                                            return (
                                                <div 
                                                    key={tier.id}
                                                    className={`p-6 bg-white border rounded-xl flex flex-col justify-between gap-6 shadow-xs relative ${
                                                        isCurrent ? 'border-blue-600 border-2' : 'border-slate-200'
                                                    }`}
                                                >
                                                    {isCurrent && (
                                                        <span className="absolute top-0 right-6 transform -translate-y-1/2 px-2.5 py-0.5 bg-blue-600 text-white text-[9px] font-black tracking-widest uppercase rounded">Current plan</span>
                                                    )}
                                                    <div className="flex flex-col gap-2">
                                                        <h3 className="text-lg font-black text-slate-800">{tier.name}</h3>
                                                        <div className="flex items-baseline gap-1 mt-1">
                                                            <span className="text-3xl font-black text-slate-900">{tier.price}</span>
                                                            {tier.price !== 'Custom' && <span className="text-xs text-slate-400">/ month</span>}
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-semibold mt-2 leading-relaxed">{tier.desc}</p>
                                                    </div>

                                                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                                                        <div className="flex justify-between text-xs text-slate-600 font-bold">
                                                            <span>Ingest Limit:</span>
                                                            <span>{tier.limitAdd}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs text-slate-600 font-bold">
                                                            <span>Search Limit:</span>
                                                            <span>{tier.limitRet}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs text-slate-600 font-bold">
                                                            <span>Support tier:</span>
                                                            <span>{tier.support}</span>
                                                        </div>
                                                    </div>

                                                    {tier.id === 'production' ? (
                                                        <button 
                                                            onClick={() => alert("Contacting sales representative... Directing to sales@drive.io")}
                                                            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors"
                                                        >
                                                            Contact Sales
                                                        </button>
                                                    ) : isCurrent ? (
                                                        <button 
                                                            disabled 
                                                            className="w-full py-2 bg-slate-100 text-slate-400 font-bold rounded-lg text-xs cursor-not-allowed border border-slate-200"
                                                        >
                                                            Plan Active
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => {
                                                                if (tier.id === 'developer') {
                                                                    setIsUpgradeModalOpen(true);
                                                                } else {
                                                                    setPlan(tier.id);
                                                                }
                                                            }}
                                                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-md shadow-blue-500/10"
                                                        >
                                                            Upgrade Tier
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>

            {/* MODALS */}
            
            {/* Modal: Delete API Key confirmation */}
            {keyToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full shadow-lg">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-2.5 bg-red-50 border border-red-100 text-red-600 rounded-full">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-950 mb-1">Revoke Agent Access?</h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                    You are about to revoke this agent&apos;s access. Any active scraper fleet or background process using this key will lose edge authorization instantly.
                                </p>
                             </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setKeyToDelete(null)}
                                className="flex-1 px-4 py-2.5 rounded-lg font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors border border-slate-200"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteKey(keyToDelete)}
                                className="flex-1 px-4 py-2.5 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition-all flex justify-center items-center"
                                disabled={isDeleting}
                            >
                                {isDeleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Confirm Revoke"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Simulated Stripe Checkout */}
            {isUpgradeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-sm w-full shadow-lg flex flex-col gap-4">
                        <div className="text-center flex flex-col items-center gap-2">
                            <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-full">
                                <CreditCard className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-black text-slate-950">Stripe Payment Simulation</h3>
                            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                                You are upgrading to the <strong className="text-slate-800">Developer Plan ($25/mo)</strong>. Click submit to simulate a successful Stripe billing check-out session.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={handleUpgradeSubmit}
                                disabled={upgradeLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-md shadow-blue-500/10 flex justify-center items-center gap-1.5"
                            >
                                {upgradeLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Complete checkout"}
                            </button>
                            <button 
                                onClick={() => setIsUpgradeModalOpen(false)}
                                disabled={upgradeLoading}
                                className="w-full text-slate-500 hover:text-slate-700 font-bold py-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100 text-xs"
                            >
                                Cancel checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Log view details */}
            {selectedLogDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-md w-full shadow-lg flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-black text-slate-950">Request Detail</h3>
                            <button 
                                onClick={() => setSelectedLogDetail(null)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 font-mono text-xs text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div><strong>Request ID:</strong> {selectedLogDetail.id}</div>
                            <div><strong>Timestamp:</strong> {new Date(selectedLogDetail.timestamp).toLocaleString()}</div>
                            <div><strong>Method:</strong> {selectedLogDetail.method}</div>
                            <div><strong>Endpoint:</strong> {selectedLogDetail.endpoint}</div>
                            <div><strong>Status:</strong> {selectedLogDetail.status}</div>
                            <div><strong>Latency:</strong> {selectedLogDetail.latency}</div>
                            <div><strong>Agent Key:</strong> {selectedLogDetail.keyName}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Webhook event payload detail */}
            {selectedWebhookLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-lg w-full shadow-lg flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-black text-slate-950">Webhook Event Log</h3>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedWebhookLog.event}</span>
                            </div>
                            <button 
                                onClick={() => setSelectedWebhookLog(null)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <pre className="p-4 bg-slate-950 text-slate-100 text-xs font-mono rounded-lg overflow-x-auto whitespace-pre leading-relaxed">
                            {selectedWebhookLog.payload}
                        </pre>
                    </div>
                </div>
            )}

        </div>
    );
}
