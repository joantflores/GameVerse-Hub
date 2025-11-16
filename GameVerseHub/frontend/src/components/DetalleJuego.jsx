import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerDetalleJuego } from "../services/dataService";
import { useAuth } from "../contexts/AuthContext";
import { agregarFavorito, eliminarFavorito, obtenerFavoritos } from "../services/firestoreService";
import { useToast } from "../contexts/ToastContext";

export default function DetalleJuego() {
    const { id } = useParams();
    const { usuario } = useAuth();
    const { success, error: toastError } = useToast();
    const [juego, setJuego] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [esFavorito, setEsFavorito] = useState(false);

    useEffect(() => {
        cargarJuego();
        if (usuario) {
            verificarFavorito();
        }
    }, [id, usuario]);

    const cargarJuego = async () => {
        setCargando(true);
        try {
            const data = await obtenerDetalleJuego(id);
            setJuego(data);
        } catch (err) {
            console.error("Error al cargar juego:", err);
            toastError("Error al cargar los detalles del juego");
        } finally {
            setCargando(false);
        }
    };

    const verificarFavorito = async () => {
        if (!usuario) return;
        const result = await obtenerFavoritos(usuario.uid);
        if (result.success) {
            setEsFavorito(result.favoritos.some(f => f.id === parseInt(id)));
        }
    };

    const toggleFavorito = async () => {
        if (!usuario) {
            toastError("Debes iniciar sesión para agregar favoritos");
            return;
        }

        try {
            if (esFavorito) {
                const result = await eliminarFavorito(usuario.uid, parseInt(id));
                if (result.success) {
                    setEsFavorito(false);
                    success("Juego eliminado de favoritos");
                }
            } else {
                const result = await agregarFavorito(usuario.uid, juego);
                if (result.success) {
                    setEsFavorito(true);
                    success("Juego agregado a favoritos");
                }
            }
        } catch (err) {
            console.error("Error al cambiar favorito:", err);
            toastError("Error al cambiar favorito");
        }
    };

    const formatearFecha = (timestamp) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    if (cargando) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (!juego) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    <h4>Juego no encontrado</h4>
                    <p>El juego que buscas no existe o no está disponible.</p>
                    <Link to="/catalogo" className="btn btn-primary">Volver al catálogo</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/catalogo" className="btn btn-outline-secondary mb-3">
                ← Volver al catálogo
            </Link>

            <div className="row">
                <div className="col-md-4 mb-4">
                    {juego.cover?.url && (
                        <img
                            src={juego.cover.url.replace("t_thumb", "t_cover_big")}
                            className="img-fluid rounded shadow"
                            alt={juego.name}
                        />
                    )}
                </div>
                <div className="col-md-8">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h1>{juego.name}</h1>
                        {usuario && (
                            <button
                                className={`btn btn-lg ${esFavorito ? "btn-warning" : "btn-outline-secondary"}`}
                                onClick={toggleFavorito}
                            >
                                {esFavorito ? "⭐" : "☆"}
                            </button>
                        )}
                    </div>

                    {juego.rating && (
                        <div className="mb-3">
                            <span className="badge bg-primary fs-6">
                                ⭐ Rating: {juego.rating.toFixed(1)} / 100
                            </span>
                            {juego.rating_count && (
                                <span className="badge bg-secondary ms-2 fs-6">
                                    {juego.rating_count} votos
                                </span>
                            )}
                        </div>
                    )}

                    {juego.first_release_date && (
                        <p className="text-muted mb-3">
                            <strong>Fecha de lanzamiento:</strong> {formatearFecha(juego.first_release_date)}
                        </p>
                    )}

                    {juego.genres && juego.genres.length > 0 && (
                        <div className="mb-3">
                            <strong>Géneros:</strong>
                            {juego.genres.map((g, i) => (
                                <span key={i} className="badge bg-primary me-2">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {juego.platforms && juego.platforms.length > 0 && (
                        <div className="mb-3">
                            <strong>Plataformas:</strong>
                            {juego.platforms.map((p, i) => (
                                <span key={i} className="badge bg-info me-2">
                                    {p.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {juego.involved_companies && juego.involved_companies.length > 0 && (
                        <div className="mb-3">
                            <strong>Desarrolladores:</strong>
                            {juego.involved_companies.map((c, i) => (
                                <span key={i} className="badge bg-secondary me-2">
                                    {c.company?.name || c.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {juego.summary && (
                        <div className="mb-3">
                            <h5>Descripción</h5>
                            <p>{juego.summary}</p>
                        </div>
                    )}

                    {juego.storyline && (
                        <div className="mb-3">
                            <h5>Historia</h5>
                            <p>{juego.storyline}</p>
                        </div>
                    )}

                    {juego.screenshots && juego.screenshots.length > 0 && (
                        <div className="mb-3">
                            <h5>Capturas de pantalla</h5>
                            <div className="row g-2">
                                {juego.screenshots.slice(0, 6).map((screenshot, i) => (
                                    <div key={i} className="col-6 col-md-4">
                                        <img
                                            src={screenshot.url?.replace("t_thumb", "t_1080p") || screenshot.url}
                                            className="img-fluid rounded"
                                            alt={`Screenshot ${i + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

