"use client";

import { useEffect, useState } from 'react';
import { UploadResult } from '@/services/mockUpload';
import { migrateOldUploads } from '@/services/migrateUploads';
import { Trash2, Copy, FileText, Image as ImageIcon, File, Clock } from 'lucide-react';
import { RecentItem } from './RecentItem';

export function RecentList() {
    const [uploads, setUploads] = useState<UploadResult[]>([]);
    const [mounted, setMounted] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('recent_uploads');
        if (stored) {
            setUploads(JSON.parse(stored));
        }

        // Listen for updates
        const handleStorage = () => {
            const stored = localStorage.getItem('recent_uploads');
            if (stored) {
                setUploads(JSON.parse(stored));
            }
        };

        window.addEventListener('storage-update', handleStorage);
        return () => window.removeEventListener('storage-update', handleStorage);
    }, []);

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const deleteItem = (id: string) => {
        const newUploads = uploads.filter(u => u.id !== id);
        setUploads(newUploads);
        localStorage.setItem('recent_uploads', JSON.stringify(newUploads));
    };


    if (!mounted || uploads.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Uploads</h3>
                <span className="text-xs text-gray-500">{uploads.length} FILE{uploads.length !== 1 ? 'S' : ''}</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {uploads.map((upload) => (
                    <RecentItem
                        key={upload.id}
                        upload={upload}
                        isCopied={copiedId === upload.id}
                        onCopy={copyToClipboard}
                        onDelete={deleteItem}
                    />
                ))}
            </div>

            {/* Carbon Ads Placeholder */}
            <div className="mt-12 border border-border-color p-4 flex items-center justify-between bg-surface/20 max-w-sm ml-auto">
                <div className="text-xs text-gray-500">
                    <p className="font-bold text-white mb-1">Developer Portfolio Hosting</p>
                    <p>Showcase your work with style.</p>
                </div>
                <div className="w-8 h-8 bg-gray-700"></div>
            </div>
        </div>
    );
}
