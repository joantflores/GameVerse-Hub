import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { obtenerFavoritos, eliminarFavorito } from "../services/firestoreService";
import { Link } from "react-router-dom";

export default function Favoritos() {
    const { usuario } = useAuth();
    const { success, error: toastError } = useToast();
    const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (usuario) {
            cargarFavoritos();
        } else {
            setCargando(false);
        }
    }, [usuario]);

    const cargarFavoritos = async () => {
        if (!usuario) return;
        
        setCargando(true);
        const result = await obtenerFavoritos(usuario.uid);
        if (result.success) {
            setFavoritos(result.favoritos);
        }
        setCargando(false);
    };

    const handleEliminar = async (juegoId) => {
        if (!usuario) return;
        
        const confirmar = window.confirm("Are you sure you want to remove this game from favorites?");
        if (!confirmar) return;

        const result = await eliminarFavorito(usuario.uid, juegoId);
        if (result.success) {
            success("Game removed from favorites");
            // Recargar favoritos
            await cargarFavoritos();
        } else {
            toastError("Error removing favorite: " + result.error);
        }
    };

    if (!usuario) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    <h4 className="alert-heading">Sign In</h4>
                    <p>You must sign in to see your favorite games.</p>
                    <hr />
                    <Link to="/login" className="btn btn-primary">Sign In</Link>
                </div>
            </div>
        );
    }

    if (cargando) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading favorites...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>⭐ My Favorites</h2>
                <span className="badge bg-secondary">{favoritos.length} games</span>
            </div>

            {favoritos.length === 0 ? (
                <div className="alert alert-info" role="alert">
                    <h4 className="alert-heading">You don't have favorites yet</h4>
                    <p>Start adding games to your favorites from the <Link to="/catalogo">catalog</Link>.</p>
                </div>
            ) : (
                <div className="row">
                    {favoritos.map((juego) => (
                        <div className="col-md-4 mb-4" key={juego.id}>
                            <div className="card h-100">
                                {juego.cover?.url && (
                                    <img
                                        src={juego.cover.url.replace("t_thumb", "t_cover_big")}
                                        className="card-img-top"
                                        alt={juego.name}
                                        style={{ height: "300px", objectFit: "cover" }}
                                    />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">
                                        <Link to={`/juego/${juego.id}`} className="text-decoration-none text-dark">
                                            {juego.name}
                                        </Link>
                                    </h5>
                                    {juego.summary && (
                                        <p className="card-text flex-grow-1">
                                            {juego.summary.length > 150
                                                ? juego.summary.substring(0, 150) + "..."
                                                : juego.summary}
                                        </p>
                                    )}
                                    {juego.genres && (
                                        <div className="mb-2">
                                            {juego.genres.map((g) => (
                                                <span key={g.id} className="badge bg-primary me-1">
                                                    {g.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-auto d-flex gap-2">
                                        <Link 
                                            to={`/juego/${juego.id}`}
                                            className="btn btn-primary btn-sm flex-grow-1"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleEliminar(juego.id)}
                                            title="Remove from favorites"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

