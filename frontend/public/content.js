// Inject modal styles
function injectModalStyles() {
    const styleId = 'codeclip-modal-styles';
    if (document.getElementById(styleId)) return;

    const styles = document.createElement('style');
    styles.id = styleId;
    styles.textContent = `
        .codeclip-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
        }

        .codeclip-modal {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }

        .codeclip-modal-header {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .codeclip-modal-header h2 {
            font-size: 20px;
            font-weight: 600;
            color: #333333;
            margin: 0;
        }

        .codeclip-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999999;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s ease;
        }

        .codeclip-modal-close:hover {
            color: #333333;
        }

        .codeclip-modal-body {
            padding: 20px;
        }

        .codeclip-form-group {
            margin-bottom: 16px;
        }

        .codeclip-form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            font-size: 14px;
            color: #333333;
        }

        .codeclip-form-group input[type="text"],
        .codeclip-form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
            transition: border-color 0.2s ease;
            box-sizing: border-box;
        }

        .codeclip-form-group input[type="text"]:focus,
        .codeclip-form-group textarea:focus {
            outline: none;
            border-color: #4a90e2;
            box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }

        .codeclip-form-group textarea {
            min-height: 100px;
            resize: vertical;
            font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
        }

        .codeclip-form-error {
            color: #e74c3c;
            font-size: 13px;
            margin-top: 4px;
        }

        .codeclip-modal-footer {
            padding: 20px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }

        .codeclip-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .codeclip-btn-primary {
            background-color: #4a90e2;
            color: white;
        }

        .codeclip-btn-primary:hover:not(:disabled) {
            background-color: #357abd;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .codeclip-btn-secondary {
            background-color: #95a5a6;
            color: white;
        }

        .codeclip-btn-secondary:hover:not(:disabled) {
            background-color: #7f8c8d;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .codeclip-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .codeclip-snippet-preview {
            background-color: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 12px;
            margin-bottom: 16px;
            font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
            font-size: 12px;
            color: #333333;
            max-height: 150px;
            overflow-y: auto;
            word-break: break-word;
            white-space: pre-wrap;
        }

        .codeclip-snippet-label {
            font-size: 12px;
            color: #666666;
            margin-bottom: 4px;
            font-weight: 500;
        }
    `;
    document.head.appendChild(styles);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "SHOW_MODAL") {
        createModal(request.selectedText, request.pageUrl);
        sendResponse({ success: true });
    }
    return true;
});

function createModal(snippet, source) {
    injectModalStyles();

    const overlay = document.createElement('div');
    overlay.className = 'codeclip-modal-overlay';
    overlay.id = 'codeclip-modal-overlay';

    overlay.innerHTML = `
        <div class="codeclip-modal" id="codeclip-modal">
            <div class="codeclip-modal-header">
                <h2>Save Snippet to CodeClip</h2>
                <button class="codeclip-modal-close" id="codeclip-modal-close">×</button>
            </div>

            <div class="codeclip-modal-body">
                <div class="codeclip-form-group">
                    <label>Snippet Preview</label>
                    <div class="codeclip-snippet-preview">${escapeHtml(snippet)}</div>
                </div>

                <div class="codeclip-form-group">
                    <label>Source</label>
                    <div style="padding: 10px 12px; background-color: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 14px; color: #666666; word-break: break-all;">${escapeHtml(source)}</div>
                </div>

                <form id="codeclip-save-form">
                    <div class="codeclip-form-group">
                        <label for="codeclip-title">Title <span style="color: #e74c3c;">*</span></label>
                        <input 
                            type="text" 
                            id="codeclip-title" 
                            placeholder="e.g., React Hooks Pattern"
                            required
                            autofocus
                        >
                        <div class="codeclip-form-error" id="codeclip-title-error" style="display: none;">Title is required</div>
                    </div>

                    <div class="codeclip-form-group">
                        <label for="codeclip-language">Language <span style="color: #e74c3c;">*</span></label>
                        <input 
                            type="text" 
                            id="codeclip-language" 
                            placeholder="e.g., JavaScript, Python, CSS"
                            required
                        >
                        <div class="codeclip-form-error" id="codeclip-language-error" style="display: none;">Language is required</div>
                    </div>
                </form>
            </div>

            <div class="codeclip-modal-footer">
                <button class="codeclip-btn codeclip-btn-secondary" id="codeclip-cancel">Cancel</button>
                <button class="codeclip-btn codeclip-btn-primary" id="codeclip-save">Save Snippet</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const titleInput = document.getElementById('codeclip-title');
    const languageInput = document.getElementById('codeclip-language');
    const saveButton = document.getElementById('codeclip-save');
    const cancelButton = document.getElementById('codeclip-cancel');
    const closeButton = document.getElementById('codeclip-modal-close');
    const modal = document.getElementById('codeclip-modal');

    // Close modal on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Close modal on close button click
    closeButton.addEventListener('click', closeModal);

    // Close modal on cancel button click
    cancelButton.addEventListener('click', closeModal);

    // Handle save
    saveButton.addEventListener('click', async (e) => {
        e.preventDefault();

        const title = titleInput.value.trim();
        const language = languageInput.value.trim();

        // Clear previous errors
        document.getElementById('codeclip-title-error').style.display = 'none';
        document.getElementById('codeclip-language-error').style.display = 'none';

        let isValid = true;

        if (!title) {
            document.getElementById('codeclip-title-error').style.display = 'block';
            isValid = false;
        }
        if (!language) {
            document.getElementById('codeclip-language-error').style.display = 'block';
            isValid = false;
        }

        if (!isValid) return;

        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        // Send message to background script to make the API call
        chrome.runtime.sendMessage({
            action: "SAVE_SNIPPET",
            data: { title, language, source, text: snippet }
        }, (response) => {
            if (response && response.success === true) {
                closeModal();
            } else {
                saveButton.disabled = false;
                saveButton.textContent = 'Save Snippet';
                const errorMsg = response?.error || 'Unknown error';
                alert('Error saving snippet: ' + errorMsg);
            }
        });
    });

    function closeModal() {
        overlay.remove();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
