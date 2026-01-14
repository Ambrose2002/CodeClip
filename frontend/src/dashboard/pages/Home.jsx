import SnippetView from "./SnippetView"
import SnippetCreate from "./SnippetCreate"
import { useState, useEffect } from "react"
import { API_BASE_URL } from "../utilities"
import '../styles/Home.css'
import '../styles/shared.css'

export default function Home() {
    const [snippets, setSnippets] = useState([])
    const [query, setQuery] = useState('')
    const [activeSnippet, setActiveSnippet] = useState(0)
    const [error, setError] = useState('')
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const handleSnippetUpdate = (updatedSnippet) => {
        setSnippets(snippets.map((snippet, index) =>
            index === activeSnippet ? updatedSnippet : snippet
        ))
    }
    const handleSnippetCreated = (created) => {
        setSnippets(prev => [created, ...prev])
        setActiveSnippet(0)
        setIsCreateOpen(false)
    }
    const handleSnippetDeleted = (deletedId) => {
        const newSnippets = snippets.filter(s => s.id !== deletedId)
        setSnippets(newSnippets)
        setActiveSnippet(Math.max(0, activeSnippet - 1))
    }

    useEffect(() => {
        const openCreate = () => setIsCreateOpen(true)
        window.addEventListener('codeclip-open-create', openCreate)
        return () => window.removeEventListener('codeclip-open-create', openCreate)
    }, [])
    useEffect(() => {
        const fetchSnippets = async () => {
            try {
                let response

                if (query.length == 0) {
                    response = await fetch(`${API_BASE_URL}/get/clips`)
                }
                else {
                    response = await fetch(`${API_BASE_URL}/clip/query`, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query })
                    })
                }

                if (!response.ok) {
                    console.log("not okay")
                    throw new Error("error fetching clips")
                }
                const data = await response.json()
                if (!data.ok) {
                    setError(data.error)
                    throw new Error("error fetching clips")
                }
                if (!query) {
                    const sortedSnippets = data.data
                        .slice()
                        .sort((a, b) => {
                            const aTime = a?.date_modified
                                ? Date.parse(a.date_modified)
                                : a?.date_created
                                    ? Date.parse(a.date_created)
                                    : NaN
                            const bTime = b?.date_modified
                                ? Date.parse(b.date_modified)
                                : b?.date_created
                                    ? Date.parse(b.date_created)
                                    : NaN

                            const aHas = !Number.isNaN(aTime)
                            const bHas = !Number.isNaN(bTime)

                            // Both have a timestamp: newest first
                            if (aHas && bHas) {
                                return bTime - aTime
                            }
                            // Prefer items with any timestamp
                            if (aHas && !bHas) return -1
                            if (!aHas && bHas) return 1

                            // Fallback: alphabetical by title
                            return String(a.title || '').localeCompare(String(b.title || ''))
                        })
                    setSnippets(sortedSnippets)
                } else {
                    setSnippets(data.data)
                }
                setActiveSnippet(0)

            } catch (error) {
                setError("Failed to fetch snippets")
                console.log(error)
            }
        }
        fetchSnippets();
    }, [query])
    return (
        <div className="home-container">
            <div className="home-sidebar">
                <div className="sidebar-search">
                    <input type="text" placeholder="🔍 Search" onChange={(e) => setQuery(e.target.value)} />
                </div>
                <ul className="snippets-list">
                    {snippets.map((item, index) => (
                        <li
                            key={index}
                            onClick={(e) => setActiveSnippet(index)}
                            className={activeSnippet === index ? 'active' : ''}
                        >
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="home-content">
                <div className="snippet-view-container">
                    {(activeSnippet < snippets.length) ? (
                        <SnippetView snippet={snippets[activeSnippet]} onSnippetUpdate={handleSnippetUpdate} onSnippetDeleted={handleSnippetDeleted} />
                    ) : (
                        <div className="no-snippet">Select a snippet to view details</div>
                    )}
                </div>
                {isCreateOpen && (
                    <SnippetCreate
                        onClose={() => setIsCreateOpen(false)}
                        onSnippetCreated={handleSnippetCreated}
                    />
                )}
            </div>
        </div>
    )
}