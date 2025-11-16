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
            console.error("Error cargando datos del dashboard:", err);
        } finally {
            setCargando(false);
        }
    };

    const formatearFecha = (timestamp) => {
        if (!timestamp) return "";
        if (timestamp instanceof Timestamp) {
            return timestamp.toDate().toLocaleDateString("es-ES");
        }
        if (timestamp.seconds) {
            return new Date(timestamp.seconds * 1000).toLocaleDateString("es-ES");
        }
        return new Date(timestamp).toLocaleDateString("es-ES");
    };

    if (!usuario) {
        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="text-center py-5">
                            <h1 className="display-4 mb-4">🎮 GameVerse Hub</h1>
                            <p className="lead mb-4">
                                Tu centro integral para todo sobre videojuegos. Explora catálogos, 
                                juega trivia y descubre tus juegos favoritos.
                            </p>
                            <div className="row g-3 mt-4 justify-content-center">
                                <div className="col-md-5">
                                    <div className="card h-100">
                                        <div className="card-body text-center">
                                            <h3>🎯 Catálogo</h3>
                                            <p>Explora miles de videojuegos con búsqueda avanzada y filtros</p>
                                            <Link to="/catalogo" className="btn btn-primary">
                                                Explorar Catálogo
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="card h-100">
                                        <div className="card-body text-center">
                                            <h3>🎲 Trivia</h3>
                                            <p>Pon a prueba tus conocimientos sobre videojuegos</p>
                                            <Link to="/trivia" className="btn btn-primary">
                                                Jugar Trivia
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5">
                                <p className="text-muted">
                                    <Link to="/login">Inicia sesión</Link> o{" "}
                                    <Link to="/registro">regístrate</Link> para guardar tus favoritos 
                                    y ver tu historial de actividad.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cargando) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    const mejorPuntajeTrivia = historialTrivia.length > 0 
        ? Math.max(...historialTrivia.map(t => t.puntaje || 0))
        : 0;

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col-12">
                    <h1>👋 ¡Hola, {userData?.displayName || usuario.email}!</h1>
                    <p className="text-muted">Bienvenido a tu Dashboard</p>
                </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="row mb-4">
                <div className="col-md-4 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h2 className="display-4">{favoritos.length}</h2>
                            <p className="card-text">⭐ Juegos Favoritos</p>
                            <Link to="/favoritos" className="btn btn-sm btn-outline-primary">
                                Ver Todos
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h2 className="display-4">{historialTrivia.length}</h2>
                            <p className="card-text">🎲 Partidas de Trivia</p>
                            {mejorPuntajeTrivia > 0 && (
                                <small className="text-muted">
                                    Mejor puntaje: {mejorPuntajeTrivia}
                                </small>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card text-center">
                        <div className="card-body">
                            <h2 className="display-4">{historialBusquedas.length}</h2>
                            <p className="card-text">🔍 Búsquedas Recientes</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Favoritos recientes */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">⭐ Favoritos Recientes</h5>
                            <Link to="/favoritos" className="btn btn-sm btn-outline-primary">
                                Ver Todos
                            </Link>
                        </div>
                        <div className="card-body">
                            {favoritos.length === 0 ? (
                                <p className="text-muted">
                                    No tienes favoritos todavía.{" "}
                                    <Link to="/catalogo">Explora el catálogo</Link> para agregar algunos.
                                </p>
                            ) : (
                                <div className="row g-2">
                                    {favoritos.map((juego) => (
                                        <div key={juego.id} className="col-6">
                                            <Link 
                                                to={`/juego/${juego.id}`}
                                                className="text-decoration-none"
                                            >
                                                <div className="card h-100">
                                                    {juego.cover?.url && (
                                                        <img
                                                            src={juego.cover.url.replace("t_thumb", "t_cover_small")}
                                                            className="card-img-top"
                                                            alt={juego.name}
                                                            style={{ height: "100px", objectFit: "cover" }}
                                                        />
                                                    )}
                                                    <div className="card-body p-2">
                                                        <h6 className="card-title small mb-0 text-truncate">
                                                            {juego.name}
                                                        </h6>
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

                {/* Historial de trivia */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">🎲 Historial de Trivia</h5>
                        </div>
                        <div className="card-body">
                            {historialTrivia.length === 0 ? (
                                <p className="text-muted">
                                    No has jugado trivia todavía.{" "}
                                    <Link to="/trivia">¡Juega tu primera partida!</Link>
                                </p>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {historialTrivia.map((resultado, index) => (
                                        <div key={index} className="list-group-item px-0">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>
                                                        {resultado.puntaje || 0} / {resultado.totalPreguntas || 0}
                                                    </strong>
                                                    <span className="badge bg-info ms-2">
                                                        {resultado.porcentaje?.toFixed(0) || 0}%
                                                    </span>
                                                </div>
                                                <small className="text-muted">
                                                    {formatearFecha(resultado.fecha)}
                                                </small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-3 text-center">
                                <Link to="/trivia" className="btn btn-primary btn-sm">
                                    Jugar Trivia
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Búsquedas recientes */}
                <div className="col-md-12 mb-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="mb-0">🔍 Búsquedas Recientes</h5>
                        </div>
                        <div className="card-body">
                            {historialBusquedas.length === 0 ? (
                                <p className="text-muted">
                                    No has realizado búsquedas todavía.{" "}
                                    <Link to="/catalogo">Busca tu juego favorito</Link>
                                </p>
                            ) : (
                                <div className="d-flex flex-wrap gap-2">
                                    {historialBusquedas.map((item, index) => (
                                        <Link
                                            key={index}
                                            to={`/catalogo?q=${encodeURIComponent(item.busqueda)}`}
                                            className="badge bg-secondary p-2 text-decoration-none"
                                        >
                                            {item.busqueda}
                                        </Link>
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

