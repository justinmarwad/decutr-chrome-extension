// content_script.js - Runs in webpage context

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "processSelection") {
        copyToClipboard(message.data);
        sendResponse({ success: true });
    }
    return true; // Keeps the message channel open for async responses
});

// Copies formatted content to clipboard
async function copyToClipboard(htmlContent) {
    try {
        await navigator.clipboard.write([new ClipboardItem({'text/html': new Blob([htmlContent], { type: 'text/html' })})]);
    } catch (err) {
        console.error('Failed to copy HTML content: ', err);
    }
}
