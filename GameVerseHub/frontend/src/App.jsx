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

export default function App() {
    return (
        <AuthProvider>
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
                    </Routes>
                </Router>
            </ToastProvider>
        </AuthProvider>
    );
}
