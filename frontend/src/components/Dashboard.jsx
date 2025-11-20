import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { obtenerHistorialBusquedas, obtenerHistorialTrivia, obtenerFavoritos } from "../services/firestoreService";
import { Timestamp } from "firebase/firestore";

export default function Dashboard() {
    const { usuario, userData } = useAuth();
    const [historialBusquedas, setHistorialBusquedas] = useState([]);
    const [historialTrivia, setHistorialTrivia] = useState([]);
       const [favoritos, setFavoritos] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (usuario) {
            cargarDatos();
        } else {
            setCargando(false);
        }
    }, [usuario]);

    const cargarDatos = async () => {
        if (!usuario) return;
        setCargando(true);

        try {
            const [busquedasResult, triviaResult, favoritosResult] = await Promise.all([
                obtenerHistorialBusquedas(usuario.uid),
                obtenerHistorialTrivia(usuario.uid),
                obtenerFavoritos(usuario.uid)
            ]);

            if (busquedasResult.success) {
                setHistorialBusquedas(busquedasResult.historial.slice(0, 5));
            }
            if (triviaResult.success) {
                setHistorialTrivia(triviaResult.historial.slice(0, 5));
            }
            if (favoritosResult.success) {
                setFavoritos(favoritosResult.favoritos.slice(0, 6));
            }
        } catch (err) {
            console.error("Error loading dashboard data:", err);
        } finally {
            setCargando(false);
        }
    };

    const formatearFecha = (timestamp) => {
        if (!timestamp) return "";
        if (timestamp instanceof Timestamp) return timestamp.toDate().toLocaleDateString("en-US");
        if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US");
        return new Date(timestamp).toLocaleDateString("en-US");
    };

    // 🔥 Estilos del tema Dark Neon Gamer:
    const cardStyle = {
        background: "#0a0f1f",
        border: "1px solid #18a0fb",
        color: "white",
        borderRadius: "10px"
    };

    const cardHeaderStyle = {
        background: "#10182f",
        color: "#18a0fb",
        borderBottom: "1px solid #18a0fb"
    };

    const neonPurple = { color: "#8b5cf6" };
    const neonBlue = { color: "#18a0fb" };

    if (!usuario) {
        return <div className="text-center mt-5 text-white">You are not logged in.</div>;
    }

    if (cargando) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const mejorPuntajeTrivia = historialTrivia.length > 0 
        ? Math.max(...historialTrivia.map(t => t.puntaje || 0))
        : 0;

    return (
        <div className="container mt-4" style={{ color: "white" }}>
            <div className="row mb-4">
                <div className="col-12">
                    <h1 style={{ color: "#18a0fb" }}>
                        👋 Hello, {userData?.displayName || usuario.email}!
                    </h1>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card text-center" style={cardStyle}>
                        <div className="card-body">
                            <h2 className="display-4" style={neonBlue}>{favoritos.length}</h2>
                            <p>⭐ Favorite Games</p>
                            <Link to="/favoritos" className="btn btn-outline-primary btn-sm">
                                View All
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card text-center" style={cardStyle}>
                        <div className="card-body">
                            <h2 className="display-4" style={neonPurple}>{historialTrivia.length}</h2>
                            <p>🎲 Trivia Games Played</p>
                            {mejorPuntajeTrivia > 0 && (
                                <small style={neonBlue}>
                                    Best score: {mejorPuntajeTrivia}
                                </small>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card text-center" style={cardStyle}>
                        <div className="card-body">
                            <h2 className="display-4" style={neonBlue}>{historialBusquedas.length}</h2>
                            <p>🔍 Recent Searches</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* FAVORITOS */}
                <div className="col-md-6 mb-4">
                    <div className="card" style={cardStyle}>
                        <div className="card-header" style={cardHeaderStyle}>
                            <h5 className="mb-0">⭐ Recent Favorites</h5>
                        </div>
                        <div className="card-body">
                            {favoritos.length === 0 ? (
                                <p className="text-muted">No favorites yet.</p>
                            ) : (
                                <div className="row g-2">
                                    {favoritos.map((juego) => (
                                        <div key={juego.id} className="col-6">
                                            <Link to={`/juego/${juego.id}`} className="text-decoration-none">
                                                <div className="card h-100" style={{ background: "#10182f", border: "1px solid #8b5cf6" }}>
                                                    <img
                                                        src={juego.cover?.url.replace("t_thumb", "t_cover_small")}
                                                        className="card-img-top"
                                                        style={{ height: "110px", objectFit: "cover" }}
                                                    />
                                                    <div className="card-body p-2">
                                                        <h6 className="text-truncate" style={neonBlue}>{juego.name}</h6>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* TRIVIA HISTORY */}
                <div className="col-md-6 mb-4">
                    <div className="card" style={cardStyle}>
                        <div className="card-header" style={cardHeaderStyle}>
                            <h5 className="mb-0">🎲 Trivia History</h5>
                        </div>
                        <div className="card-body">
                            {historialTrivia.length === 0 ? (
                                <p className="text-muted">You haven't played trivia yet.</p>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {historialTrivia.map((resultado, index) => (
                                        <div key={index} className="list-group-item" 
                                            style={{
                                                background: "#0a0f1f",
                                                borderBottom: "1px solid #10182f",
                                                color: "white"
                                            }}>
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <strong style={neonBlue}>
                                                        {resultado.puntaje} / {resultado.totalPreguntas}
                                                    </strong>
                                                    <span className="badge ms-2" 
                                                        style={{ background: "#8b5cf6", color: "white" }}>
                                                        {resultado.porcentaje.toFixed(0)}%
                                                    </span>
                                                </div>
                                                <small style={neonPurple}>
                                                    {formatearFecha(resultado.fecha)}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="text-center mt-3">
                                <Link to="/trivia"
                                    className="btn btn-sm"
                                    style={{
                                        background: "#18a0fb",
                                        color: "white"
                                    }}>
                                    Play Trivia
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEARCH HISTORY */}
                <div className="col-md-12 mb-4">
                    <div className="card" style={cardStyle}>
                        <div className="card-header" style={cardHeaderStyle}>
                            <h5 className="mb-0">🔍 Recent Searches</h5>
                        </div>
                        <div className="card-body">
                            {historialBusquedas.length === 0 ? (
                                <p className="text-muted">No recent searches.</p>
                            ) : (
                                <div className="d-flex flex-wrap gap-2">
                                    {historialBusquedas.map((item, index) => (
                                        <span key={index}
                                            className="badge p-2"
                                            style={{
                                                background: "#8b5cf6",
                                                color: "white",
                                                fontSize: "14px",
                                                border: "1px solid #18a0fb"
                                            }}>
                                            {item.busqueda}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
