import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { obtenerDetalleJuego } from "../services/dataService";
import { useAuth } from "../contexts/AuthContext";
import { agregarFavorito, eliminarFavorito, obtenerFavoritos } from "../services/firestoreService";
import { useToast } from "../contexts/ToastContext";
import { useState } from "react";


export default function DetalleJuego() {
    const { id } = useParams();
    const { usuario } = useAuth();
    const { success, error: toastError } = useToast();
    const [juego, setJuego] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [esFavorito, setEsFavorito] = useState(false);
    const [reseña,setreseña]=useState("");

    const send_review = async () => 
        {
        if (!usuario) {
            toastError("You must sign in to add a review");
            return;
        }

        try {
            const response = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gameId: id,
                userId: usuario.uid,
                review: reseña
            })
            });

            const data = await response.json();
            if (data.success) {
            success("Reseña enviada correctamente");
            setreseña("");
            } else {
            toastError("Error al enviar la reseña");
            }
        } catch (err) {
            console.error("Error al enviar reseña:", err);
            toastError("Error al conectar con el servidor");
        }
        };

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
            console.error("Error loading game:", err);
            toastError("Error loading game details");
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
            toastError("You must sign in to add favorites");
            return;
        }

        try {
            if (esFavorito) {
                const result = await eliminarFavorito(usuario.uid, parseInt(id));
                if (result.success) {
                    setEsFavorito(false);
                    success("Game removed from favorites");
                }
            } else {
                const result = await agregarFavorito(usuario.uid, juego);
                if (result.success) {
                    setEsFavorito(true);
                    success("Game added to favorites");
                }
            }
        } catch (err) {
            console.error("Error toggling favorite:", err);
            toastError("Error toggling favorite");
        }
    };

    const formatearFecha = (timestamp) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    if (cargando) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!juego) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning" role="alert">
                    <h4>Game not found</h4>
                    <p>The game you are looking for does not exist or is not available.</p>
                    <Link to="/catalogo" className="btn btn-primary">Back to catalog</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Link to="/catalogo" className="btn btn-outline-secondary mb-3">
                ← Back to catalog
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
                                    {juego.rating_count} votes
                                </span>
                            )}
                        </div>
                    )}

                    {juego.first_release_date && (
                        <p className="text-muted mb-3">
                            <strong>Release date:</strong> {formatearFecha(juego.first_release_date)}
                        </p>
                    )}

                    {juego.genres && juego.genres.length > 0 && (
                        <div className="mb-3">
                            <strong>Genres:</strong>
                            {juego.genres.map((g, i) => (
                                <span key={i} className="badge bg-primary me-2">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {juego.platforms && juego.platforms.length > 0 && (
                        <div className="mb-3">
                            <strong>Platforms:</strong>
                            {juego.platforms.map((p, i) => (
                                <span key={i} className="badge bg-info me-2">
                                    {p.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {juego.involved_companies && juego.involved_companies.length > 0 && (
                        <div className="mb-3">
                            <strong>Developers:</strong>
                            {juego.involved_companies.map((c, i) => (
                                <span key={i} className="badge bg-secondary me-2">
                                    {c.company?.name || c.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {juego.summary && (
                        <div className="mb-3">
                            <h5>Description</h5>
                            <p>{juego.summary}</p>
                        </div>
                    )}

                    {juego.storyline && (
                        <div className="mb-3">
                            <h5>Storyline</h5>
                            <p>{juego.storyline}</p>
                        </div>
                    )}

                    {juego.screenshots && juego.screenshots.length > 0 && (
                        <div className="mb-3">
                            <h5>Screenshots</h5>
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
                    {usuario && (
                        <div className="mb-4">
                            <h5>Escribe tu reseña</h5>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={reseña}
                                    onChange={(e) => setreseña(e.target.value)}
                                    placeholder="¿Qué te pareció este juego?"
                                    />
                            <button className="btn btn-primary mt-2" onClick={send_review}>
                            Enviar reseña
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

