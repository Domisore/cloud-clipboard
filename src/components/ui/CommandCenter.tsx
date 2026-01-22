"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePaste } from '@/hooks/usePaste';
import { useSession } from '@/context/SessionContext';
import { uploadFile } from '@/services/upload';
import { FileText, Image as ImageIcon, Link as LinkIcon, X, Flame, UploadCloud, CheckCircle } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

type UploadState = 'idle' | 'has-content' | 'uploading' | 'success';

export function CommandCenter() {
    const { wallet, sessionId, renameSession } = useSession();
    // Find current session data in wallet
    const currentSession = wallet.find(s => s.sessionId === sessionId);

    const [state, setState] = useState<UploadState>('idle');
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [burnOnRead, setBurnOnRead] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ url: string } | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Session Name Edit State
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        if (currentSession) {
            setTempName(currentSession.name);
        }
    }, [currentSession]);

    // PWA Share Target Handler
    useEffect(() => {
        try {
            const pendingShare = localStorage.getItem('drive_pending_share');
            if (pendingShare) {
                const data = JSON.parse(pendingShare);
                localStorage.removeItem('drive_pending_share'); // Clear immediately

                if (data.file) {
                    // Reconstruct file
                    fetch(`data:${data.file.type};base64,${data.file.data}`)
                        .then(res => res.blob())
                        .then(blob => {
                            const file = new File([blob], data.file.name, { type: data.file.type });
                            onFileSelect(file);
                        });
                } else if (data.text || data.url) {
                    const content = [data.title, data.text, data.url].filter(Boolean).join('\n');
                    setText(content);
                    setState('has-content');
                }
            }
        } catch (e) {
            console.error('Failed to parse share data', e);
        }
    }, []);

    const handleNameSave = () => {
        if (currentSession && tempName.trim()) {
            renameSession(currentSession.key, tempName);
        }
        setIsEditingName(false);
    };

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

                // If this was a new session launch (no current session), 
                // the upload might have triggered a session creation implicitly via cookies?
                // Actually the upload service doesn't create sessions explicitly, 
                // but the API middleware might. 
                // We should check status after upload to ensure wallet sync.
                // The upload result doesn't return session info usually.

                // For now, standard behavior.

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
                {/* Session Header */}
                {currentSession && (state === 'idle' || state === 'has-content') && (
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-center z-10 pointer-events-none">
                        <div className="pointer-events-auto bg-surface/80 backdrop-blur-sm rounded-full border border-border-color px-4 py-1.5 flex items-center gap-2 shadow-sm">
                            <span className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">Session:</span>
                            {isEditingName ? (
                                <input
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onBlur={handleNameSave}
                                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                                    className="bg-transparent border-b border-accent text-xs font-bold text-foreground focus:outline-none w-32"
                                    autoFocus
                                />
                            ) : (
                                <button
                                    onClick={() => {
                                        setTempName(currentSession.name);
                                        setIsEditingName(true);
                                    }}
                                    className="text-xs font-bold text-foreground hover:text-accent transition-colors flex items-center gap-1.5"
                                >
                                    {currentSession.name}
                                    <div className="i-lucide-edit-2 w-3 h-3 opacity-50" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* STATE: IDLE or TYPING */}
                {(state === 'idle' || state === 'has-content') && !file && (
                    <div className="relative min-h-[160px] flex flex-col">
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                                setState(e.target.value ? 'has-content' : 'idle');
                            }}
                            placeholder="Type plain text, code, or paste an image..."
                            className="w-full h-full min-h-[160px] bg-transparent p-4 sm:p-6 text-foreground font-mono resize-none focus:outline-none placeholder:text-foreground-muted/50"
                            autoFocus
                        />

                        {/* Empty State Hint (only visible when empty) */}
                        {!text && (
                            <div className="absolute inset-0 flex items-center justify-center text-foreground-muted/30 pointer-events-none bg-transparent">
                                <div
                                    className="text-center pointer-events-auto cursor-pointer hover:text-accent/50 transition-colors p-4 rounded-lg"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="text-sm font-medium mb-2">Drop files or paste content</div>
                                    <div className="flex gap-2 justify-center text-xs opacity-60 mb-2">
                                        <kbd className="bg-surface/50 px-2 py-1 rounded">⌘ V</kbd>
                                        <span>or</span>
                                        <kbd className="bg-surface/50 px-2 py-1 rounded">Ctrl V</kbd>
                                    </div>
                                    <div className="text-xs opacity-50">(or click to browse)</div>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    onFileSelect(e.target.files[0]);
                                }
                            }}
                        />
                    </div>
                )}

                {/* STATE: FILE PREVIEW */}
                {file && state !== 'success' && (
                    <div className="min-h-[160px] flex flex-col items-center justify-center p-6 text-center bg-surface/30">
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
                            Create Link
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
                                <div className="text-foreground font-medium animate-pulse">Encrypting & Uploading...</div>
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
