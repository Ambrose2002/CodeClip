import './Popup.css';

export default function Popup() {
    const openDashboard = () => {
        chrome.tabs.create({
            url: chrome.runtime.getURL("dashboard.html")
        })
    }

    return (
        <div className="popup-container">
            <div className="popup-header">
                <div className="popup-logo">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="6" fill="#4a90e2"/>
                        <path d="M9 12h14M9 16h14M9 20h10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </div>
                <h1 className="popup-title">CodeClip</h1>
            </div>
            
            <p className="popup-description">
                Save and organize your code snippets across the web
            </p>

            <button className="popup-button" onClick={openDashboard}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Open CodeClip Library
            </button>

            <div className="popup-footer">
                <p className="popup-hint">
                    💡 Select code on any page and right-click to save
                </p>
            </div>
        </div>
    )
}