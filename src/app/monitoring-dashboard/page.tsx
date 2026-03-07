'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    Link as LinkIcon,
    FileText,
    HardDrive,
    RefreshCw
} from 'lucide-react';

interface MetricsData {
    activeSessions: number;
    permanentLinks: number;
    uploadedFiles: number;
    textClips: number;
    lastUpdated: string;
}

export default function MonitoringDashboard() {
    const [metrics, setMetrics] = useState<MetricsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/monitoring/usage');
            if (!response.ok) {
                throw new Error('Failed to fetch metrics');
            }
            const { data } = await response.json();
            setMetrics(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
        // Optional: Auto-refresh every 30 seconds
        const interval = setInterval(fetchMetrics, 30000);
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        {
            title: 'Active Sessions',
            value: metrics?.activeSessions ?? '-',
            icon: Activity,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
            border: 'border-blue-500/20'
        },
        {
            title: 'Permanent Links',
            value: metrics?.permanentLinks ?? '-',
            icon: LinkIcon,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
            border: 'border-purple-500/20'
        },
        {
            title: 'Uploaded Files',
            value: metrics?.uploadedFiles ?? '-',
            icon: HardDrive,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            border: 'border-emerald-500/20'
        },
        {
            title: 'Text Clips',
            value: metrics?.textClips ?? '-',
            icon: FileText,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            border: 'border-amber-500/20'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8 md:p-16 font-sans selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                    <div className="space-y-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400"
                        >
                            Pulse
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-slate-400 text-lg"
                        >
                            Global application usage metrics
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex items-center gap-4"
                    >
                        {metrics?.lastUpdated && (
                            <span className="text-sm text-slate-500 font-medium">
                                Last updated: {new Date(metrics.lastUpdated).toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={fetchMetrics}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </motion.div>
                </div>

                {/* Content */}
                {error ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 rounded-2xl bg-red-950/30 border border-red-500/20 text-red-400 flex items-center gap-4"
                    >
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <div>
                            <h3 className="font-semibold text-lg">Failed to load metrics</h3>
                            <p className="text-red-400/80">{error}</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat, i) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * i + 0.3 }}
                                className={`relative group p-6 rounded-2xl bg-slate-900 border ${stat.border} hover:border-slate-700 transition-colors overflow-hidden`}
                            >
                                {/* Hover Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 space-y-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                                        <div className="flex items-baseline gap-2">
                                            {loading && !metrics ? (
                                                <div className="h-10 w-24 bg-slate-800 rounded animate-pulse" />
                                            ) : (
                                                <h2 className="text-4xl font-bold text-white tracking-tight">
                                                    {typeof stat.value === 'number' ? new Intl.NumberFormat().format(stat.value) : stat.value}
                                                </h2>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// Just needed for the error state icon above
const AlertCircle = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
);
