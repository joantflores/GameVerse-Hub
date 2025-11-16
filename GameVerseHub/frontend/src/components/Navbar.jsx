import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { cerrarSesion } from "../services/authService";

export default function Navbar() {
    const { usuario, userData, cargando } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await cerrarSesion();
        navigate("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand" to="/">🎮 GameVerse Hub</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/catalogo">Catálogo</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/trivia">Trivia</Link>
                        </li>
                        {usuario && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/favoritos">⭐ Favoritos</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {!cargando && (
                            <>
                                {usuario ? (
                                    <>
                                        <li className="nav-item dropdown">
                                            <a
                                                className="nav-link dropdown-toggle"
                                                href="#"
                                                role="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                👤 {userData?.displayName || usuario.email || "Usuario"}
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <span className="dropdown-item-text">
                                                        <small>{usuario.email}</small>
                                                    </span>
                                                </li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li>
                                                    <button className="dropdown-item" onClick={handleLogout}>
                                                        Cerrar Sesión
                                                    </button>
                                                </li>
                                            </ul>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login">
                                                Iniciar Sesión
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/registro">
                                                Registrarse
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
