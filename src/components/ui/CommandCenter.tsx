"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePaste } from '@/hooks/usePaste';
import { uploadFile } from '@/services/upload';
import { FileText, Image as ImageIcon, Link as LinkIcon, X, Flame, UploadCloud, CheckCircle } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

type UploadState = 'idle' | 'has-content' | 'uploading' | 'success';

export function CommandCenter() {
    const [state, setState] = useState<UploadState>('idle');
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [burnOnRead, setBurnOnRead] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ url: string } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [text]);

    const handleUpload = async () => {
        if (!file && !text) return;

        setState('uploading');
        try {
            let fileToUpload = file;
            if (!fileToUpload && text) {
                const blob = new Blob([text], { type: 'text/plain' });
                fileToUpload = new File([blob], `paste-${Date.now()}.txt`, { type: 'text/plain' });
            }

            if (fileToUpload) {
                const result = await uploadFile(fileToUpload, burnOnRead);
                setUploadResult(result);

                // Save to local storage for RecentList
                const existing = JSON.parse(localStorage.getItem('recent_uploads') || '[]');
                const uploadWithSnippet = {
                    ...result,
                    textSnippet: fileToUpload.type === 'text/plain' && fileToUpload.size < 10240
                        ? (text || await fileToUpload.text().then(t => t.slice(0, 50)))
                        : undefined
                };
                localStorage.setItem('recent_uploads', JSON.stringify([uploadWithSnippet, ...existing]));
                window.dispatchEvent(new Event('storage-update'));

                setState('success');
            }
        } catch (err) {
            console.error(err);
            setState('idle'); // TODO: Error check
        }
    };

    const reset = () => {
        setState('idle');
        setText('');
        setFile(null);
        setUploadResult(null);
    };

    const onFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setText(''); // Clear text if file is dropped
        setState('has-content');
    };

    // Paste Hook
    usePaste((files, pastedText) => {
        if (files.length > 0) {
            onFileSelect(files[0]);
        } else if (pastedText) {
            setText(prev => prev ? prev + '\n' + pastedText : pastedText);
            setFile(null);
            setState('has-content');
        }
    });

    // Drag Handlers
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4">
            <div
                className={`
                    relative group transition-all duration-300 rounded-xl overflow-hidden
                    ${dragActive ? 'scale-[1.02] ring-2 ring-accent' : ''}
                    ${state === 'idle' || state === 'has-content' ? 'glass-panel shadow-2xl' : ''}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* STATE: IDLE or TYPING */}
                {(state === 'idle' || state === 'has-content') && !file && (
                    <div className="relative min-h-[300px] flex flex-col">
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                                setState(e.target.value ? 'has-content' : 'idle');
                            }}
                            placeholder="Type plain text, code, or paste anything..."
                            className="w-full h-full min-h-[300px] bg-transparent p-6 sm:p-8 text-foreground font-mono resize-none focus:outline-none placeholder:text-foreground-muted/50"
                            autoFocus
                        />

                        {/* Empty State Hint (only visible when empty) */}
                        {!text && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-foreground-muted/30">
                                <div className="text-center">
                                    <p className="text-sm font-medium mb-2">Drop files or paste content</p>
                                    <div className="flex gap-2 justify-center text-xs opacity-60">
                                        <kbd className="bg-surface/50 px-2 py-1 rounded">⌘ V</kbd>
                                        <span>or</span>
                                        <kbd className="bg-surface/50 px-2 py-1 rounded">Ctrl V</kbd>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STATE: FILE PREVIEW */}
                {file && state !== 'success' && (
                    <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center bg-surface/30">
                        <div className="w-20 h-20 rounded-2xl bg-surface border border-border-color flex items-center justify-center mb-6 shadow-lg">
                            {file.type.startsWith('image/') ? <ImageIcon className="w-10 h-10 text-accent" /> : <FileText className="w-10 h-10 text-accent" />}
                        </div>
                        <h3 className="text-xl font-medium text-foreground mb-2">{file.name}</h3>
                        <p className="text-sm text-foreground-muted mb-8">{(file.size / 1024).toFixed(1)} KB</p>
                        <button
                            onClick={reset}
                            className="absolute top-4 right-4 p-2 hover:bg-surface/50 rounded-full text-foreground-muted hover:text-danger transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* ACTION BAR (Bottom) */}
                {(state === 'has-content' || file) && state !== 'uploading' && state !== 'success' && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent flex items-center justify-between pb-6 px-6">
                        <div className="flex items-center gap-2">
                            <Tooltip content="Burn on read: deleted after 1 view">
                                <button
                                    onClick={() => setBurnOnRead(!burnOnRead)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${burnOnRead
                                            ? 'bg-danger/10 border-danger/30 text-danger'
                                            : 'bg-surface/50 border-transparent text-foreground-muted hover:text-foreground'
                                        }`}
                                >
                                    <Flame className="w-3.5 h-3.5" />
                                    <span>{burnOnRead ? 'Auto-destruct' : 'Burn off'}</span>
                                </button>
                            </Tooltip>
                        </div>

                        <button
                            onClick={handleUpload}
                            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-background font-bold text-sm rounded-lg hover:bg-accent/90 transform hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(88,166,255,0.3)]"
                        >
                            {state === 'uploading' ? 'Publishing...' : 'Create Link'}
                            <UploadCloud className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                )}

                {/* STATE: UPLOADING / SUCCESS */}
                {(state === 'uploading' || state === 'success') && (
                    <div className="absolute inset-0 bg-surface/95 backdrop-blur-md flex flex-col items-center justify-center z-10 p-8">
                        {state === 'uploading' ? (
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mb-6"></div>
                                <p className="text-foreground font-medium animate-pulse">Encrypting & Uploading...</p>
                            </div>
                        ) : (
                            <div className="w-full max-w-md animate-slide-up">
                                <div className="flex flex-col items-center text-center mb-8">
                                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4 text-accent">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-2">Link Ready!</h2>
                                    <p className="text-foreground-muted text-sm">Anyone with this link can view the content.</p>
                                </div>

                                <div className="bg-background rounded-lg p-1.5 border border-border-color flex items-center gap-2 mb-6">
                                    <input
                                        readOnly
                                        value={uploadResult?.url || ''}
                                        className="flex-1 bg-transparent px-3 text-sm font-mono text-accent outline-none"
                                    />
                                    <button
                                        onClick={() => navigator.clipboard.writeText(uploadResult?.url || '')}
                                        className="px-4 py-2 bg-surface hover:bg-surface-hover border border-border-color rounded text-xs font-bold text-foreground transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>

                                <button
                                    onClick={reset}
                                    className="w-full py-3 text-sm text-foreground-muted hover:text-foreground transition-colors"
                                >
                                    Upload another
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
