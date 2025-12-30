"use client";

import { useState, useCallback } from 'react';
import { usePaste } from '@/hooks/usePaste';
import { clsx } from 'clsx';
import { uploadFile } from '@/services/mockUpload';

export function DropZone() {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

    const handleUpload = useCallback(async (file: File) => {
        setIsUploading(true);
        setUploadSuccess(null);

        try {
            const result = await uploadFile(file);

            // Save to local storage
            const existing = JSON.parse(localStorage.getItem('recent_uploads') || '[]');
            const updated = [result, ...existing];
            localStorage.setItem('recent_uploads', JSON.stringify(updated));

            // Dispatch event for RecentList
            window.dispatchEvent(new Event('storage-update'));

            setUploadSuccess(result.url);

            // Clear success message after 3 seconds
            setTimeout(() => setUploadSuccess(null), 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleUpload(files[0]);
        }
    }, [handleUpload]);

    const handlePaste = useCallback((files: File[], text: string | null) => {
        if (files.length > 0) {
            handleUpload(files[0]);
        } else if (text) {
            // Create a text file from the content
            const blob = new Blob([text], { type: 'text/plain' });
            const file = new File([blob], `paste-${Date.now()}.txt`, { type: 'text/plain' });
            handleUpload(file);
        }
    }, [handleUpload]);

    usePaste(handlePaste);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 border-2 border-dashed border-border-color rounded-none relative">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Card 1: Paste Text */}
                <div className="aspect-square border border-border-color bg-surface/50 flex flex-col items-center justify-center gap-4 hover:border-accent hover:text-accent transition-colors group cursor-pointer" onClick={() => navigator.clipboard.readText().then(t => handlePaste([], t))}>
                    <div className="w-16 h-16 border-2 border-current flex items-center justify-center rounded-lg">
                        <span className="text-4xl font-bold">T</span>
                    </div>
                    <p className="text-sm font-medium">Paste Text (Ctrl+V)</p>
                </div>

                {/* Card 2: Paste Image */}
                <div className="aspect-square border border-border-color bg-surface/50 flex flex-col items-center justify-center gap-4 hover:border-accent hover:text-accent transition-colors group cursor-pointer">
                    <div className="w-16 h-16 border-2 border-current flex items-center justify-center rounded-lg">
                        <div className="w-10 h-8 border-2 border-current rounded-sm relative">
                            <div className="absolute top-1 right-1 w-2 h-2 bg-current rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-sm font-medium">Paste Image (Ctrl+V)</p>
                </div>

                {/* Card 3: Drag & Drop */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={clsx(
                        "aspect-square border border-border-color bg-surface/50 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer",
                        isDragging ? "border-accent bg-accent/10 shadow-hacker-green" : "hover:border-accent hover:text-accent"
                    )}
                >
                    <div className="w-16 h-16 flex items-center justify-center">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold">Drag & Drop</p>
                        <p className="text-lg font-bold">Here</p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-400 max-w-xs text-center sm:text-left">
                    Upload files, paste text, or share clipboard images instantly.
                </p>

                <div className="flex items-center gap-4">
                    {/* Toggle Placeholder */}
                    <div className="w-12 h-6 bg-gray-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>

                    {/* Buy Me Coffee */}
                    <button className="flex items-center gap-2 bg-white text-black px-3 py-1 text-xs font-bold hover:bg-accent transition-colors">
                        <span>☕</span>
                        <span>Buy Me a Coffee</span>
                    </button>

                    <button className="bg-white text-black px-3 py-1 text-xs font-bold hover:bg-accent transition-colors">
                        Copy Link
                    </button>
                </div>
            </div>

            {/* Status Overlay */}
            {isUploading && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                    <div className="text-accent font-bold text-xl animate-pulse">
                        UPLOADING...
                    </div>
                </div>
            )}

            {/* Success Overlay */}
            {uploadSuccess && !isUploading && (
                <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10">
                    <div className="text-center space-y-4 p-6">
                        <div className="text-accent font-bold text-2xl">
                            ✓ UPLOADED
                        </div>
                        <div className="text-white text-sm font-mono break-all max-w-md">
                            {uploadSuccess}
                        </div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(uploadSuccess);
                                setUploadSuccess(null);
                            }}
                            className="bg-white text-black px-4 py-2 text-sm font-bold hover:bg-accent transition-colors"
                        >
                            COPY_LINK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
