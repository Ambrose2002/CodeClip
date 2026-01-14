import SnippetView from "./SnippetView"
import { useState, useEffect } from "react"
import { API_BASE_URL } from "../utilities"
import '../styles/Home.css'
import '../styles/shared.css'

export default function Home() {
    const [snippets, setSnippets] = useState([])
    const [query, setQuery] = useState('')
    const [activeSnippet, setActiveSnippet] = useState(0)
    const [error, setError] = useState('')

    const handleSnippetUpdate = (updatedSnippet) => {
        setSnippets(snippets.map((snippet, index) =>
            index === activeSnippet ? updatedSnippet : snippet
        ))
    }
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
                    const sortedSnippets = data.data.sort((a, b) => {
                        const a_modified = a.date_modified
                        const b_modified = b.date_modified
                        if (a_modified && b_modified) {
                            return b_modified.localeCompare(a_modified)
                        }
                        if (!a_modified && !b_modified) {
                            return a.title.localeCompare(b.title)
                        }
                        if (a_modified) {
                            return -1
                        }
                        return 1
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
                        <SnippetView snippet={snippets[activeSnippet]} onSnippetUpdate={handleSnippetUpdate} />
                    ) : (
                        <div className="no-snippet">Select a snippet to view details</div>
                    )}
                </div>
            </div>
        </div>
    )
}