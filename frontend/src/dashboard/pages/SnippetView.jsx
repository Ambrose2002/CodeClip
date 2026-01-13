export default function SnippetView({snippet}) {
    return (
        <div>
            <p>Title: {snippet.title}</p>
            <p>Language: {snippet.language}</p>
            <p>Date created: {snippet.date_created}</p>
            <p>Source: {snippet.source}</p>
            <p>Snippet: {snippet.text}</p>

            <button>Edit</button>
            <button>Delete</button>
        </div>
    )
}