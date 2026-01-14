import { useState } from 'react';
import { API_BASE_URL } from '../utilities';
import '../styles/EditSnippet.css'
import '../styles/shared.css'

// Modal for creating a new snippet
export default function SnippetCreate({ onClose, onSnippetCreated }) {
    const [title, setTitle] = useState('')
    const [language, setLanguage] = useState('')
    const [source, setSource] = useState('')
    const [text, setText] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const isFormValid = title.trim().length > 0 && language.trim().length > 0 && source.trim().length > 0 && text.trim().length > 0

    const handleSave = async (event) => {
        event.preventDefault();
        setError('');
        // Require all fields (trimmed) before submission
        if (!isFormValid) {
            setSubmitted(true)
            setError('All fields are required')
            return
        }
        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/post/clip`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                // Backend expects keys: text, title, language, source
                body: JSON.stringify({ title, language, source, text })
            })

            const data = await response.json()
            if (!response.ok || (data && data.ok === false)) {
                setError(data?.error || "Error saving snippet")
                throw new Error("Failed to save snippet")
            }

            const created = Array.isArray(data?.data) ? data.data[0] : null
            if (created && onSnippetCreated) {
                onSnippetCreated(created)
            }
            onClose()
        } catch (error) {
            setError("Error saving snippet")
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
        }}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create Snippet</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    {error && <div className="form-error">{error}</div>}

                    <form className="edit-form">
                        <div className="form-group">
                            <label htmlFor="title">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                aria-invalid={submitted && !title.trim()}
                            />
                            {submitted && !title.trim() && (
                                <div className="form-error">Title is required</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="language">Language</label>
                            <input
                                id="language"
                                type="text"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                required
                                aria-invalid={submitted && !language.trim()}
                            />
                            {submitted && !language.trim() && (
                                <div className="form-error">Language is required</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="source">Source</label>
                            <input
                                id="source"
                                type="text"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                required
                                aria-invalid={submitted && !source.trim()}
                            />
                            {submitted && !source.trim() && (
                                <div className="form-error">Source is required</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="text">Snippet</label>
                            <textarea
                                id="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                required
                                aria-invalid={submitted && !text.trim()}
                            />
                            {submitted && !text.trim() && (
                                <div className="form-error">Snippet text is required</div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose} disabled={isLoading}>Cancel</button>
                    <button className="btn-primary" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}