import { useAuth } from "../../shared/auth/AuthContext";
import { useNavigate } from 'react-router-dom';
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

    return (
        <div>
            <p>CodeClip</p>
            <p>Welcome {user.email}!</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}