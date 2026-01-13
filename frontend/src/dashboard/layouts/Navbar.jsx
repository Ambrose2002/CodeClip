import { useAuth } from "../../shared/auth/AuthContext";
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const { user, loading, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate()

    async function handleLogout(event) {
        try {
            await logout();
            navigate('/login')
        } catch (error) {
            navigate('/login')
        }
    }

    function handleAddSnippet() {
        // Navigate to add snippet page
        navigate('/create')
    }

    return (
        <nav className="navbar">
            <h1 className="navbar-brand">CodeClip</h1>

            <div className="navbar-right">
                <p className="navbar-welcome">Welcome {user?.email}!</p>
                <button onClick={handleLogout} className="navbar-button">
                    Logout
                </button>
                <button onClick={handleAddSnippet} className="navbar-add-button" title="Add Snippet">
                    +
                </button>
            </div>
        </nav>
    )
}