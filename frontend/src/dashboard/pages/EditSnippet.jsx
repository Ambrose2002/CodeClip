import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utilities';
import '../styles/EditSnippet.css'
import '../styles/shared.css'

export default function EditSnippet({ snippet, onClose, onSnippetUpdate }) {
    const [title, setTitle] = useState(snippet.title)
    const [language, setLanguage] = useState(snippet.language)
    const [source, setSource] = useState(snippet.source)
    const [code, setCode] = useState(snippet.text)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const isFormValid = title.trim().length > 0 && language.trim().length > 0 && source.trim().length > 0 && code.trim().length > 0

    const handleSave = async (event) => {
        event.preventDefault();
        setError('');
        if (!isFormValid) {
            setSubmitted(true)
            setError('All fields are required')
            return
        }
        setIsLoading(true)

        try {
            const response = await fetch(`${API_BASE_URL}/clip/edit/${snippet.id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, language, source, code })
            })

            if (!response.ok) {
                setError("Error saving snippet")
                throw new Error("Failed to save snippet")
            }

            const updatedSnippet = {
                ...snippet,
                title,
                language,
                source,
                text: code
            }
            onSnippetUpdate(updatedSnippet)
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
                    <h2>Edit Snippet</h2>
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
                            <label htmlFor="code">Snippet</label>
                            <textarea
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                                aria-invalid={submitted && !code.trim()}
                            />
                            {submitted && !code.trim() && (
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