import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import RequireAuth from "../shared/auth/RequireAuth"
import Layout from "./layouts/Layout"

import Signup from "./pages/Signup"
import Home from "./pages/Home"
// import SnippetCreate from "./pages/SnippetCreate"
// import SnippetView from "./pages/SnippetView"

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup />}></Route>

                <Route
                    path="/"
                    element={
                        <RequireAuth>
                            <Layout>
                                <Home />
                            </Layout>
                        </RequireAuth>
                    }
                ></Route>
            </Routes>
        </HashRouter>
    )
}