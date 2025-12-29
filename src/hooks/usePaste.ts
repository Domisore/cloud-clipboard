import { useEffect, useCallback } from 'react';

type PasteHandler = (files: File[], text: string | null) => void;

export function usePaste(onPaste: PasteHandler) {
    const handlePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        const files: File[] = [];
        let text: string | null = null;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file) files.push(file);
            } else if (item.kind === 'string' && item.type === 'text/plain') {
                item.getAsString((s) => {
                    text = s;
                    // If we have text and no files were found in this loop iteration (async issue potentially, but usually fine for paste)
                    // We trigger the callback. 
                    // Note: This logic is slightly simplified. For mixed content, we might want to wait.
                    // But usually clipboard is either files OR text.
                    if (files.length === 0 && text) {
                        onPaste([], text);
                    }
                });
            }
        }

        if (files.length > 0) {
            onPaste(files, null);
        }
    }, [onPaste]);

    useEffect(() => {
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [handlePaste]);
}
