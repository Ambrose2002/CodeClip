chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "codeClipId",
        title: "Save snippet to CodeClip",
        type: "normal",
        contexts: ["selection"]
    })
})

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "SAVE_SNIPPET") {
        const { title, language, source, text } = request.data;

        try {
            const response = await fetch("http://127.0.0.1:8000/api/post/clip", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, language, source, text })
            })

            if (!response.ok) {
                sendResponse({ success: false, error: "failure posting clip" })
            }

            const data = await response.json()

            if (!data.ok) {
                sendResponse({ success: false, error: "failure posting clip" })
            }
            sendResponse({ success: true })
        } catch (error) {
            sendResponse({ success: false, error: data.error })
        }

    }
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {

    if (item.menuItemId == "codeClipId") {
        const selectedText = item.selectionText;
        const pageUrl = item.pageUrl

        try {
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