import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
    const { usuario, userData, cargando } = useAuth();

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
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/catalogo">Catalog</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/trivia">Trivia</Link>
                        </li>
                        {usuario && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/favoritos">⭐ Favorites</Link>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav">
                        {!cargando && (
                            <>
                                {usuario ? (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/perfil">
                                                👤 {userData?.displayName || usuario.email || "User"}
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login">
                                                Sign In
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/registro">
                                                Sign Up
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
