export default function Popup() {
    const openDashboard = () => {
        chrome.tabs.create({
            url: chrome.runtime.getURL("dashboard.html")
        })
    }

    return (
        <div style={{ width: 300, padding: 12 }}>
            <h3>Snippet Saver</h3>
            <button onClick={openDashboard}>
                Open Snippet Library
            </button>
        </div>
    )
}