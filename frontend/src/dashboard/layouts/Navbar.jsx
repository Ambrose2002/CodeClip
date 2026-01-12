import { useAuth } from "../../shared/auth/AuthContext";
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const { user, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate()

    if (!isAuthenticated) {
        navigate('/login')
    }

    async function handleLogout(event) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/logout', {
                credentials: "include",
                method: "GET"
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            navigate('/login')
        } catch (error) {
            navigate('/login')
        }
        
    }

    return (
        <div>
            <p>CodeClip</p>
            <p>Welcome {user.email}!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}