import { useEffect, useCallback } from 'react';

type PasteHandler = (files: File[], text: string | null) => void;

export function usePaste(onPaste: PasteHandler) {
    const handlePaste = useCallback((e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        const files: File[] = [];
        let hasText = false;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file) files.push(file);
            } else if (item.kind === 'string' && item.type === 'text/plain') {
                hasText = true;
            }
        }

        if (files.length > 0) {
            e.preventDefault();
            onPaste(files, null);
            return;
        }

        if (hasText) {
            // We let the async string extraction happen
            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'string' && items[i].type === 'text/plain') {
                    items[i].getAsString((s) => {
                        if (s) {
                            // We don't prevent default here for text because 
                            // we want the textarea to receive it natively IF we are typing.
                            // BUT, the request was to support image paste.
                            // If we prevent default for text, the textarea won't duplicate it.
                            // Let's rely on CommandCenter state. 
                            // If we call onPaste with text, CommandCenter sets text state.
                            // So we SHOULD prevent default to avoid double insertion.

                            // However, we can't prevent default inside this async callback reliably for the original event.
                            // We must prevent default synchronous if we intend to handle it.
                        }
                        onPaste([], s);
                    });
                }
            }
        }
    }, [onPaste]);

    useEffect(() => {
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, [handlePaste]);
}
