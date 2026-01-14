import { useState, useEffect } from 'react'
import '../styles/SnippetView.css'
import '../styles/shared.css'
import EditSnippet from './EditSnippet'

export default function SnippetView({ snippet, onSnippetUpdate }) {
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [currentSnippet, setCurrentSnippet] = useState(snippet)

    useEffect(() => {
        setCurrentSnippet(snippet)
    }, [snippet])

    const handleSnippetUpdate = (updatedSnippet) => {
        setCurrentSnippet(updatedSnippet)
        if (onSnippetUpdate) {
            onSnippetUpdate(updatedSnippet)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    }

    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (err) {
            return false;
        }
    }

    return (
        <>
            <div className="snippet-detail">
                <div className="snippet-detail-header">
                    <h2>{currentSnippet.title}</h2>
                    <div className="snippet-detail-meta">
                        <div className="meta-item">
                            <span className="meta-label">Language</span>
                            <span className="meta-value">{currentSnippet.language}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Source</span>
                            {isValidUrl(currentSnippet.source) ? <a href={currentSnippet.source} className="meta-value" target='_blank'>{currentSnippet.source}</a> : <span className="meta-value">{currentSnippet.source}</span>}
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">Created</span>
                            <span className="meta-value">{formatDate(currentSnippet.date_created)}</span>
                        </div>
                    </div>
                </div>

                <div className="snippet-detail-body">
                    <pre className="snippet-code">{currentSnippet.text}</pre>

                    <div className="snippet-actions">
                        <button className="btn-primary" onClick={() => setIsEditOpen(true)}>Edit</button>
                        <button className="btn-danger">Delete</button>
                    </div>
                </div>
            </div>

            {isEditOpen && <EditSnippet snippet={currentSnippet} onClose={() => setIsEditOpen(false)} onSnippetUpdate={handleSnippetUpdate} />}
        </>
    )
}