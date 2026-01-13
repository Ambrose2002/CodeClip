import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { API_BASE_URL } from '../utilities';

export default function EditSnippet({ snippet }) {
    const [title, setTitle] = useState('')
    const [language, setLanguage] = useState('')
    const [source, setSource] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate();

    const handleTitleChange = (event) => {
        setTitle(event.target.value)
    }

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value)
    }

    const handleSourceChange = (event) => {
        setSource(event.target.value)
    }
    const handleCodeChange = (event) => {
        setCode(event.target.value)
    }

    const handleSave = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/clip/edit${snippet.id}`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({title, language, source, code})
            })

            if (!response.ok) {
                setError("Error saving snippet")
                throw new Error("Failed to save snippet")
            }

            navigate('/')
        } catch (error) {
            setError("Error saving snippet")
            console.log(error)
        }
    }

    return (
        <div>
            {error && <div className="error-message">{error}</div>}

            <form action="">
                <label htmlFor="title">Title</label>
                <input id="email" placeholder="" value={snippet.title} type="text" required onChange={handleTitleChange} />

                <label htmlFor="language">Language</label>
                <input id="language" placeholder="" value={snippet.language} type="text" required onChange={handleLanguageChange} />

                <label htmlFor="source">Source</label>
                <input id="source" placeholder="" value={snippet.source} type="text" required onChange={handleSourceChange} />

                <label htmlFor="code">Snippet</label>
                <input id="code" placeholder="" value={snippet.text} type="text" required onChange={handleCodeChange} />

                <button>Save</button>
            </form>
        </div>
        
    )
}