export default function Popup() {
    const openDashboard = () => {
        chrome.tabs.create({
            url: chrome.runtime.getURL("dashboard.html")
        })
    }

    return (
        <div style={{ width: 300, padding: 12 }}>
            <h3>CodeClip</h3>
            <button onClick={openDashboard}>
                Open CodeCLip Library
            </button>
        </div>
    )
}