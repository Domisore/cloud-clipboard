"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UploadResult } from '@/services/mockUpload';

interface SessionContextType {
    sessionId: string | null;
    isConnected: boolean;
    files: UploadResult[];
    generateSyncCode: () => Promise<{ otp: string; expiresAt: number; magicLink: string }>;
    joinSession: (otp: string) => Promise<boolean>;
    refreshFiles: () => Promise<void>;
    disconnect: () => void;
    burnSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [files, setFiles] = useState<UploadResult[]>([]);

    // check status on mount
    useEffect(() => {
        checkStatus();
    }, []);

    // If connected, fetch files
    useEffect(() => {
        if (isConnected) {
            refreshFiles();
            // Poll for updates every 10 seconds (Pseudo-realtime until Phase 3)
            const interval = setInterval(refreshFiles, 10000);
            return () => clearInterval(interval);
        } else {
            setFiles([]);
        }
    }, [isConnected]);

    const checkStatus = async () => {
        try {
            const res = await fetch('/api/sync/status');
            const data = await res.json();
            setIsConnected(data.connected);
            setSessionId(data.sessionId);
        } catch (e) {
            console.error('Failed to check session status:', e);
        }
    };

    const refreshFiles = async () => {
        if (!sessionId && !isConnected) return;
        try {
            const res = await fetch('/api/session/files');
            if (res.ok) {
                const data = await res.json();
                // Filter out nulls from potential parse errors
                setFiles(data.files || []);
            }
        } catch (e) {
            console.error('Failed to fetch session files:', e);
        }
    };

    const generateSyncCode = async () => {
        const res = await fetch('/api/sync/generate', { method: 'POST' });
        if (!res.ok) throw new Error('Failed to generate code');
        const data = await res.json();

        // Generating a code (usually) establishes a session if we didn't have one
        // So we should re-check status or optimistically set connected?
        // Let's re-check status just to be sure cookie is set/read correctly
        await checkStatus();

        return data;
    };

    const joinSession = async (otpOrKey: string) => {
        let url = '/api/sync/join';
        let body = { otp: otpOrKey };

        // Check if it's a permanent key
        if (otpOrKey.startsWith('pk_')) {
            url = '/api/sync/perma/connect';
            body = { key: otpOrKey } as any;
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            await checkStatus();
            return true;
        }
        return false;
    };

    const disconnect = () => {
        // TODO: Call API to delete cookie?
        // For now just clear local state.
        // PRD mentions "RESET_SESSION" which invalidates server side. 
        // We'll implement server-side reset later properly.
        setSessionId(null);
        setIsConnected(false);
        setFiles([]);
    };

    const burnSession = async () => {
        try {
            await fetch('/api/sync/burn', { method: 'POST' });
        } catch (e) {
            console.error(e);
        } finally {
            // Force disconnect locally
            disconnect();
        }
    };

    return (
        <SessionContext.Provider value={{
            sessionId,
            isConnected,
            files,
            generateSyncCode,
            joinSession,
            refreshFiles,
            disconnect,
            burnSession
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}
