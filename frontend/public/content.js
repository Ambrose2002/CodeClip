chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SHOW_MODAL") {
        createModal(request.selectedText, request.pageUrl);
        sendResponse({ success: true });
    }
    return true;
});

function createModal(snippet, source) {
    const overlay = document.createElement('div');
    overlay.id = 'my-ext-overlay';
    overlay.innerHTML = `
    <div id="my-ext-modal">
      <h3>Add a Title</h3>
      <p>${snippet}</p>
      <p>${source}</p>
      <input type="text" id="my-ext-title" placeholder="Enter title..." autofocus>
      <input type="text" id="my-ext-language" placeholder="Enter language..." autofocus>
      <button id="my-ext-save">Save</button>
      <button id="my-ext-cancel">Cancel</button>
    </div>
  `;
    document.body.appendChild(overlay);

    document.getElementById('my-ext-save').onclick = () => {
        const title = document.getElementById('my-ext-title').value;
        const language = document.getElementById('my-ext-language').value;
        console.log("Saving:", { title, language, snippet, source });
        overlay.remove();

        // Send message to background script to make the API call
        chrome.runtime.sendMessage({
            action: "SAVE_SNIPPET",
            data: { title, language, source, text: snippet }
        }, (response) => {
            if (response && response.success) {
                console.log("Snippet saved successfully");
            } else {
                console.log("Error saving snippet:", response?.error);
            }
        });
    };

    document.getElementById('my-ext-cancel').onclick = () => overlay.remove();
}
