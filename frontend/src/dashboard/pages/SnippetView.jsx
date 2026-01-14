import { useState, useEffect } from 'react'
import '../styles/SnippetView.css'
import '../styles/shared.css'
import EditSnippet from './EditSnippet'
import { API_BASE_URL } from '../utilities'

export default function SnippetView({ snippet, onSnippetUpdate, onSnippetDeleted }) {
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

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${currentSnippet.title}"?`)) {
            return
        }
        try {
            const response = await fetch(`${API_BASE_URL}/delete/clip/${currentSnippet.id}`, {
                method: "DELETE",
                credentials: "include",
            })
            if (!response.ok) {
                console.error("Failed to delete snippet")
                return
            }
            if (onSnippetDeleted) {
                onSnippetDeleted(currentSnippet.id)
            }
        } catch (error) {
            console.error("Error deleting snippet:", error)
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
                        <button className="btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>

            {isEditOpen && <EditSnippet snippet={currentSnippet} onClose={() => setIsEditOpen(false)} onSnippetUpdate={handleSnippetUpdate} />}
        </>
    )
}