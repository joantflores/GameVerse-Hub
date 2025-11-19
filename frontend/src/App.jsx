import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import Navbar from "./components/Navbar";
import Catalogo from "./components/Catalogo";
import Trivia from "./components/Trivia";
import Login from "./components/Login";
import Favoritos from "./components/Favoritos";
import Dashboard from "./components/Dashboard";
import DetalleJuego from "./components/DetalleJuego";
import Perfil from "./components/Perfil";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";

export default function App() {
    const { cargando, usuario } = useAuth();

    useEffect(() => {
        if (!cargando && usuario) {
            // User is logged in and data is loaded. You can now safely navigate or perform other actions.
            // For example, if you want to redirect after a successful login handled elsewhere, you might do it here.
        }
    }, [cargando, usuario]);

    if (cargando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <ToastProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/catalogo" element={<Catalogo />} />
                    <Route path="/juego/:id" element={<DetalleJuego />} />
                    <Route path="/trivia" element={<Trivia />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Login esRegistro={true} />} />
                    <Route path="/favoritos" element={<Favoritos />} />
                    <Route path="/perfil" element={<Perfil />} />
                </Routes>
            </Router>
        </ToastProvider>
    );
}
