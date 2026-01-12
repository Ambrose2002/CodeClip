import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import RequireAuth from "../shared/auth/RequireAuth"
import Layout from "./layouts/Layout"

// import Signup from "./pages/Signup"
import SnippetList from "./pages/SnippetList"
// import SnippetCreate from "./pages/SnippetCreate"
// import SnippetView from "./pages/SnippetView"

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Layout>
                                <SnippetList />
                            </Layout>
                        </RequireAuth>
                    }
                ></Route>
            </Routes>
        </HashRouter>
    )
}