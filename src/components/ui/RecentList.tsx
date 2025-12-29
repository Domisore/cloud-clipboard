"use client";

import { useEffect, useState } from 'react';
import { UploadResult } from '@/services/mockUpload';
import { Trash2, Copy, ExternalLink } from 'lucide-react';

export function RecentList() {
    const [uploads, setUploads] = useState<UploadResult[]>([]);

    useEffect(() => {
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

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        // Could add toast here
    };

    const deleteItem = (id: string) => {
        const newUploads = uploads.filter(u => u.id !== id);
        setUploads(newUploads);
        localStorage.setItem('recent_uploads', JSON.stringify(newUploads));
    };

    if (uploads.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-6">Recent Uploads</h3>
            <div className="flex flex-col gap-0 border-t border-border-color">
                {uploads.map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between py-4 border-b border-border-color group hover:bg-surface/30 transition-colors px-2">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <span className="text-lg text-gray-300">{upload.filename}</span>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => copyToClipboard(upload.url)} className="text-xs bg-white text-black px-2 py-1 font-bold hover:bg-accent" title="Copy Link">
                                Copy Link
                            </button>
                            <button onClick={() => deleteItem(upload.id)} className="p-2 hover:text-danger" title="Burn Now">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
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
