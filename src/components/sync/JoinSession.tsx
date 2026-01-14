"use client";

import { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function JoinSession() {
    const { joinSession } = useSession();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const cleanOtp = otp.trim().replace(/\s/g, ''); // Remove all whitespace (e.g. "123 456" -> "123456")

        // Permanent Key Validation
        if (cleanOtp.startsWith('pk_')) {
            if (cleanOtp.length < 10) { // arbitrary min length check
                setError('Invalid Permanent Key');
                setLoading(false);
                return;
            }
        } else {
            // Standard OTP Validation
            if (cleanOtp.replace(/\s/g, '').length !== 6) {
                setError('Enter 6-digit code');
                setLoading(false);
                return;
            }
        }

        const success = await joinSession(cleanOtp);
        if (success) {
            setOtp('');

        } else {
            setError('Invalid code or key');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleJoin} className="relative">
            <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="ENTER 6-DIGIT CODE OR KEY"
                className="w-full bg-background border border-border-color px-4 py-3 pr-12 text-sm focus:outline-none focus:border-accent font-mono tracking-widest"
                maxLength={60}
            />
            <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-accent hover:bg-accent/10 disabled:opacity-50 transition-colors"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            </button>
            {error && <p className="absolute -bottom-6 left-0 text-[10px] text-danger font-bold">{error}</p>}
        </form>
    );
}
