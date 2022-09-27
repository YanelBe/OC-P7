import { Routes, Route } from "react-router-dom";

import PageNotFound from "./pages/PageNotFound";
import LoginRegister from "./pages/LoginRegister";
import Home from "./pages/Home";
import Header from "./components/Header";

import { AuthProvider, PostPublishProvider } from "./context/AuthContext";
import Protected from "./utils/Protected";

import "./styles/app.css";

//On enveloppe nos routes dans notre contexte d'authentification, notre contexte de publication de contenu,
//ainsi que notre route protégée comme élément enfant des routes qui ont besoin d'être protégées
function App() {
    return (
        <>
            <AuthProvider>
                <PostPublishProvider>
                    <Header />
                    <Routes>
                        <Route path="/" element={<LoginRegister />} />
                        <Route path="/home" element={
                            <Protected>
                                <Home />
                            </Protected>} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </PostPublishProvider>
            </AuthProvider>
        </>
    );
}

export default App;