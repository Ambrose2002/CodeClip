import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({ children }) {
    const { loading, isAuthenticated } = useAuth()

    if (loading) return <div>Loading...</div>

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children

}