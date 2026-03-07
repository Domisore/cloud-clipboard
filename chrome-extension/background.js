// background.js - Service Worker for the Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
    // Create a context menu item allowing users to quickly save highlighted text
    chrome.contextMenus.create({
        id: "saveToDriveIo",
        title: "Save to Pclip",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "saveToDriveIo" && info.selectionText) {
        try {
            const response = await fetch('https://drive.io/api/v1/clips', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: info.selectionText,
                    title: 'Saved from Context Menu'
                })
            });

            if (response.ok) {
                // We could show a notification here if we wanted to add the "notifications" permission
                console.log("Snippet successfully saved to Pclip");
            } else {
                console.error("Failed to save snippet", await response.text());
            }
        } catch (error) {
            console.error("Error saving to drive.io:", error);
        }
    }
});
