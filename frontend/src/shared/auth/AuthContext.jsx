import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/me", {
                    credentials: "include"
                })

                if (!response.ok) {
                    throw new Error("not logged in");
                }
                const data = await response.json()
                setUser(data.data[0])
            } catch (error) {
                setUser(null)
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        checkAuth();
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}