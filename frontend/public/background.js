chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "codeClipId",
        title: "Save snippet to CodeClip",
        type: "normal",
        contexts: ["selection"]
    })
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SAVE_SNIPPET") {
        const { title, language, source, text } = request.data;

        fetch("https://codeclip-2vhz.onrender.com/api/post/clip", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, language, source, text })
        })
            .then(response => {

                if (!response.ok) {
                    sendResponse({ success: false, error: "failure posting clip" })
                    return null;
                }

                return response.json();
            })
            .then(data => {
                if (!data) return;

                if (!data.ok) {
                    sendResponse({ success: false, error: "failure posting clip" })
                    return
                }
                sendResponse({ success: true })
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message })
            });

        return true;
    }
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {

    if (item.menuItemId == "codeClipId") {
        const pageUrl = item.pageUrl

        try {
            // Get the actual selected text from the page to preserve formatting
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const selection = window.getSelection();
                    return selection ? selection.toString() : '';
                }
            });

            const selectedText = results && results[0] ? results[0].result : item.selectionText;

            await chrome.tabs.sendMessage(tab.id, {
                action: "SHOW_MODAL",
                selectedText: selectedText,
                pageUrl: pageUrl
            })
        } catch (error) {
            console.log("Cannot inject into this page: ", error.message)
        }
    }
})