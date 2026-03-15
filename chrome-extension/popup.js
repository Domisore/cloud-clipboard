document.addEventListener('DOMContentLoaded', () => {
    const saveBtn = document.getElementById('saveBtn');
    const clipText = document.getElementById('clipText');
    const statusDisplay = document.getElementById('status');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const authStatusDiv = document.getElementById('authStatus');
    const authenticatedView = document.getElementById('authenticatedView');
    const signedOutView = document.getElementById('signedOutView');

    let selectedFile = null;

    // --- Auth & Recent Activity ---
    async function checkAuth() {
        // 1. Immediately show cached state if available
        chrome.storage.local.get(['pclipAuthState'], (result) => {
            if (result.pclipAuthState) {
                authenticatedView.style.display = 'block';
                signedOutView.style.display = 'none';
                authStatusDiv.innerHTML = `<span style="color: #4ade80;">Signed in as ${result.pclipAuthState.identifier}</span>`;
            } else {
                authenticatedView.style.display = 'none';
                signedOutView.style.display = 'block';
                authStatusDiv.textContent = 'Signed Out';
            }
        });

        // 2. Refresh state silently in the background
        try {
            const res = await fetch('https://drive.io/api/v1/auth/status', {
                credentials: 'include' // This pushes the Clerk session cookie
            });
            const data = await res.json();

            if (data.authenticated) {
                const userInfo = { identifier: data.user.identifier };
                chrome.storage.local.set({ pclipAuthState: userInfo });
                authenticatedView.style.display = 'block';
                signedOutView.style.display = 'none';
                authStatusDiv.innerHTML = `<span style="color: #4ade80;">Signed in as ${userInfo.identifier}</span>`;
                loadRecentFiles();
            } else {
                chrome.storage.local.remove('pclipAuthState');
                authenticatedView.style.display = 'none';
                signedOutView.style.display = 'block';
                authStatusDiv.textContent = 'Signed Out';
            }
        } catch (e) {
            // Keep cached state on network error, or show error if no cache
            chrome.storage.local.get(['pclipAuthState'], (result) => {
                if (!result.pclipAuthState) {
                    authenticatedView.style.display = 'none';
                    signedOutView.style.display = 'block';
                    authStatusDiv.textContent = 'Auth error';
                }
            });
        }
    }

    // Check auth immediately
    checkAuth();

    async function loadRecentFiles() {
        const recentActivityDiv = document.getElementById('recentActivity');
        const recentListDiv = document.getElementById('recentList');

        try {
            const res = await fetch('https://drive.io/api/user/files', {
                credentials: 'include'
            });

            if (!res.ok) throw new Error('Failed to load recent files');

            const data = await res.json();
            const files = data.files || [];

            if (files.length === 0) {
                recentActivityDiv.style.display = 'none';
                return;
            }

            recentActivityDiv.style.display = 'block';
            recentListDiv.innerHTML = '';

            // Only show up to 5 items
            const topFiles = files.slice(0, 5);

            topFiles.forEach(file => {
                // Parse stringified JSON if needed (sometimes redis returns string)
                let item = file;
                if (typeof file === 'string') {
                    try { item = JSON.parse(file); } catch (e) { }
                }

                const dt = new Date(item.createdAt || item.uploadedAt || Date.now());
                const dateStr = dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

                let iconHtml = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>';
                if (item.type === 'text') {
                    iconHtml = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>';
                } else if (item.contentType && item.contentType.startsWith('image/')) {
                    iconHtml = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                }

                const url = item.url || `https://drive.io/${item.id}`;
                const title = item.title || item.filename || 'Untitled Clipboard Item';

                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.className = 'recent-item';
                a.innerHTML = `
                    <div class="recent-icon">${iconHtml}</div>
                    <div class="recent-content">
                        <div class="recent-title" title="${title}">${title}</div>
                        <div class="recent-meta">${dateStr}</div>
                    </div>
                `;
                recentListDiv.appendChild(a);
            });
        } catch (e) {
            console.error('Recent activity error:', e);
            recentActivityDiv.style.display = 'none';
        }
    }

    // Focus textarea on open
    clipText.focus();

    // --- Drag and Drop Handlers ---
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleFileSelected(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelected(e.target.files[0]);
        }
    });

    function handleFileSelected(file) {
        selectedFile = file;
        dropZone.innerHTML = `<strong>Selected:</strong> ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)<br><small>Click to change</small><input type="file" id="fileInput" style="display:none;">`;
        // Re-bind click since we overwrote the HTML
        document.getElementById('fileInput').addEventListener('change', (e) => {
            if (e.target.files.length > 0) handleFileSelected(e.target.files[0]);
        });
        clipText.value = ''; // Clear text if a file is selected
        clipText.placeholder = "File selected. Text will be ignored.";
    }

    // --- Save Logic ---
    saveBtn.addEventListener('click', async () => {
        const content = clipText.value.trim();

        if (!content && !selectedFile) {
            showStatus('Please enter some text or select a file.', 'error');
            return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        showStatus('');

        try {
            if (selectedFile) {
                await uploadFile(selectedFile);
            } else {
                await saveText(content);
            }
        } catch (err) {
            console.error(err);
            showStatus('Failed to save: ' + err.message, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save to Pclip';
            selectedFile = null;
            clipText.placeholder = "Paste text or code here to save to your cloud clipboard...";
            dropZone.innerHTML = `Drag & drop a file here<br>or click to browse<input type="file" id="fileInput" style="display:none;">`;
            document.getElementById('fileInput').addEventListener('change', (e) => {
                if (e.target.files.length > 0) handleFileSelected(e.target.files[0]);
            });
            setTimeout(loadRecentFiles, 500); // refresh list after saving
        }
    });

    async function saveText(content) {
        const response = await fetch('https://drive.io/api/v1/clips', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                title: 'From Chrome Extension'
            })
        });

        if (!response.ok) throw new Error('Server returned ' + response.status);

        const data = await response.json();
        if (data.success) {
            showStatus('Saved successfully! Check your clipboard.', 'success');
            clipText.value = '';
            setTimeout(() => showLinkStatus(data.data.url, 'success'), 1500);
        } else {
            throw new Error(data.error || 'Unknown error');
        }
    }

    async function uploadFile(file) {
        showStatus('Requesting secure upload URL...', '');

        // 1. Get Pre-signed URL
        const uploadRes = await fetch('https://drive.io/api/upload', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename: file.name,
                contentType: file.type || 'application/octet-stream',
                size: file.size
            })
        });

        if (!uploadRes.ok) throw new Error('Failed to get upload URL');
        const { url, id, key } = await uploadRes.json();

        // 2. Upload to S3 directly
        showStatus(`Uploading ${file.name}...`, '');
        const s3Res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
            body: file
        });

        if (!s3Res.ok) throw new Error('Failed to upload file data');

        // 3. Complete Upload
        showStatus('Finalizing upload...', '');
        const completeRes = await fetch('https://drive.io/api/complete', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id,
                key,
                filename: file.name,
                size: file.size,
                contentType: file.type || 'application/octet-stream',
                burnAfterReading: false
            })
        });

        if (!completeRes.ok) throw new Error('Failed to finalize upload');

        showStatus('File uploaded successfully!', 'success');
        setTimeout(() => showLinkStatus(`https://drive.io/${id}`, 'success'), 1500);
    }

    function showStatus(msg, type = '') {
        statusDisplay.innerHTML = ''; // Clear html
        statusDisplay.textContent = msg;
        statusDisplay.className = type;
    }

    function showLinkStatus(url, type = '') {
        statusDisplay.innerHTML = `URL: <a href="${url}" target="_blank" class="link-out" style="display:inline; margin-top:0;">${url}</a>`;
        statusDisplay.className = type;
    }
});
