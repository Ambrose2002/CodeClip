chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "codeClipId",
        title: "Save snippet to CodeClip",
        type: "normal",
        contexts: ["selection"]
    })
})

chrome.contextMenus.onClicked.addListener((item, tab) => {

    if (item.menuItemId == "codeClipId") {
        const selectedText = item.selectionText;
        const pageUrl = item.pageUrl

        chrome.tabl.sendMessage(tab.id, {
            action: "SHOW_MODAL",
            selectedText: selectedText,
            pageUrl: pageUrl
        })
    }
})