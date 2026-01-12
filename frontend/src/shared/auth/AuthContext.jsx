import { createContext, useContext, useEffect, useState } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("fetching")
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

    const login = async (email, password) => {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status}`);
        }

        const data = await response.json()
        setUser(data.data[0]) // Update user state after successful login
        return data
    }

    const logout = async () => {
        try {
            await fetch('http://127.0.0.1:8000/api/logout', {
                method: "GET",
                credentials: "include"
            })
        } catch (error) {
            console.log(error)
        } finally {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}