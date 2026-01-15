chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: "menuId",
        title: "Save snippet to CodeClip",
        type: "normal",
        contexts: ["selection"]
    })
})