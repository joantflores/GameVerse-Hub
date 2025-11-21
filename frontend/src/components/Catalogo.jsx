//Este componente administra el catalogo de juegos del frontend, permitiendo buscar titulos, aplicar filtros localmente, 
// mostrar resultados paginados y gestionar favoritos e historial cuando el usuario esta autenticado. 
// Ademas, realiza solicitudes al backend para obtener generos y datos de los juegos, controla estados de carga y muestra 
// mensajes informativos para mejorar la experiencia del usuario.

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getJuegos, obtenerGeneros } from "../services/dataService.js";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { agregarFavorito, eliminarFavorito, obtenerFavoritos, agregarHistorialBusqueda } from "../services/firestoreService";

export default function Catalogo() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [juegos, setJuegos] = useState([]);
    const [filtro, setFiltro] = useState(searchParams.get("q") || "");
    const [loading, setLoading] = useState(false);
    const [generos, setGeneros] = useState([]);
    const [filtroGenero, setFiltroGenero] = useState("");
    const [filtroAnio, setFiltroAnio] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalJuegos, setTotalJuegos] = useState(0);
    const juegosPorPagina = 12;
    const { usuario } = useAuth();
    const { success, error: toastError } = useToast();
    const [favoritos, setFavoritos] = useState([]);

    // Cargar favoritos y generos cuando el usuario este autenticado
    useEffect(() => {
        if (usuario) {
            cargarFavoritos();
        }
        cargarGeneros();
    }, [usuario]);

    const cargarGeneros = async () => {
        const gens = await obtenerGeneros();
        setGeneros(gens);
    };

    const cargarFavoritos = async () => {
        if (!usuario) return;
        const result = await obtenerFavoritos(usuario.uid);
        if (result.success) {
            setFavoritos(result.favoritos.map(f => f.id));
        }
    };

    useEffect(() => {

        setLoading(true);
        setPaginaActual(1);

        const timeoutId = setTimeout(async () => {
            try {
                const offset = (paginaActual - 1) * juegosPorPagina;
                const data = await getJuegos(filtro, { 
                    limit: juegosPorPagina, 
                    offset: 0 
                });

                let juegosFiltrados = data;
                
                if (filtroGenero) {
                    juegosFiltrados = juegosFiltrados.filter(j => 
                        j.genres && j.genres.some(g => 
                            g.id === parseInt(filtroGenero) || g.name.toLowerCase().includes(filtroGenero.toLowerCase())
                        )
                    );
                }
                
                if (filtroAnio) {
                    juegosFiltrados = juegosFiltrados.filter(j => {
                        if (!j.first_release_date) return false;
                        const anio = new Date(j.first_release_date * 1000).getFullYear();
                        return anio.toString() === filtroAnio;
                    });
                }

                setJuegos(juegosFiltrados);
                setTotalJuegos(juegosFiltrados.length);

                if (usuario && filtro.trim()) {
                    await agregarHistorialBusqueda(usuario.uid, filtro.trim());
                }
            } catch (err) {
                console.error("Error searching games:", err);
                toastError("Error searching games");
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [filtro, usuario, filtroGenero, filtroAnio]);

    const toggleFavorito = async (juego, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!usuario) {
            toastError("You must sign in to add games to favorites");
            return;
        }

        const esFavorito = favoritos.includes(juego.id);

        try {
            if (esFavorito) {
                const result = await eliminarFavorito(usuario.uid, juego.id);
                if (result.success) {
                    setFavoritos(favoritos.filter(id => id !== juego.id));
                    success("Game removed from favorites");
                } else {
                    toastError("Error removing favorite: " + result.error);
                }
            } else {
                const result = await agregarFavorito(usuario.uid, juego);
                if (result.success) {
                    setFavoritos([...favoritos, juego.id]);
                    success("Game added to favorites");
                } else {
                    toastError("Error adding favorite: " + result.error);
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            toastError("Error toggling favorite");
        }
    };

    const formatearFecha = (timestamp) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).getFullYear();
    };

    const limpiarFiltros = () => {
        setFiltroGenero("");
        setFiltroAnio("");
    };

    return (
        <div className="container mt-4">
            <h2>🎮 Games Catalog</h2>
            {!usuario && (
                <div className="alert alert-info mb-3" role="alert">
                    <strong>💡 Tip:</strong> <Link to="/login">Sign in</Link> to save your favorite games and view your search history.
                </div>
            )}

            {/* Search */}
            <div className="mb-3">
                <input
                    className="form-control form-control-lg"
                    placeholder="Search game..."
                    value={filtro}
                    onChange={e => setFiltro(e.target.value)}
                />
            </div>

            {/* Filters */}
            {filtro.trim() !== "" && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h6 className="card-title">Filters</h6>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Genre</label>
                                <select
                                    className="form-select"
                                    value={filtroGenero}
                                    onChange={e => setFiltroGenero(e.target.value)}
                                >
                                    <option value="">All genres</option>
                                    {generos.map(g => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Release Year</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Ex: 2023"
                                    min="1970"
                                    max={new Date().getFullYear() + 1}
                                    value={filtroAnio}
                                    onChange={e => setFiltroAnio(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 d-flex align-items-end">
                                <button
                                    className="btn btn-outline-secondary w-100"
                                    onClick={limpiarFiltros}
                                    disabled={!filtroGenero && !filtroAnio}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading games...</span>
                    </div>
                    <p className="mt-2 text-muted">Searching games...</p>
                </div>
            )}

            {/* Results */}
            {!loading && filtro.trim() !== "" && juegos.length === 0 && (
                <div className="alert alert-warning" role="alert">
                    No games were found with the selected filters. Try different search terms.
                </div>
            )}

            {!loading && juegos.length > 0 && (
                <>
                    <div className="mb-3">
                        <p className="text-muted">
                            Showing <strong>{juegos.length}</strong> game{juegos.length !== 1 ? 's' : ''}
                            {totalJuegos > juegos.length && ` of ${totalJuegos}`}
                        </p>
                    </div>

                    <div className="row">
                        {juegos.map(j => (
                            <div className="col-md-4 mb-4" key={j.id}>
                                <Link to={`/juego/${j.id}`} className="text-decoration-none text-dark">
                                    <div className="card h-100 hover-shadow">
                                        {j.cover?.url && (
                                            <img
                                                src={j.cover.url.replace("t_thumb", "t_cover_big")}
                                                className="card-img-top"
                                                alt={j.name}
                                                style={{ height: "300px", objectFit: "cover" }}
                                            />
                                        )}
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title flex-grow-1">{j.name}</h5>
                                                {usuario && (
                                                    <button
                                                        className={`btn btn-sm ${favoritos.includes(j.id) ? "btn-warning" : "btn-outline-secondary"}`}
                                                        onClick={(e) => toggleFavorito(j, e)}
                                                        title={favoritos.includes(j.id) ? "Remove from favorites" : "Add to favorites"}
                                                    >
                                                        {favoritos.includes(j.id) ? "⭐" : "☆"}
                                                    </button>
                                                )}
                                            </div>
                                            {j.first_release_date && (
                                                <small className="text-muted mb-2">
                                                    {formatearFecha(j.first_release_date)}
                                                </small>
                                            )}
                                            {j.summary && (
                                                <p className="card-text flex-grow-1">
                                                    {j.summary.length > 120
                                                        ? j.summary.substring(0, 120) + "..."
                                                        : j.summary}
                                                </p>
                                            )}
                                            <div className="mt-auto">
                                                {j.genres?.slice(0, 3).map(g => (
                                                    <span key={g.id} className="badge bg-primary me-1">
                                                        {g.name}
                                                    </span>
                                                ))}
                                                {j.genres && j.genres.length > 3 && (
                                                    <span className="badge bg-secondary">
                                                        +{j.genres.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                            {j.rating && (
                                                <div className="mt-2">
                                                    <small className="text-muted">
                                                        ⭐ {j.rating.toFixed(1)} / 100
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Initial message */}
            {!loading && filtro.trim() === "" && (
                <div className="text-center py-5">
                    <h4 className="text-muted">🔍 Search your favorite game</h4>
                    <p className="text-muted">
                        Enter a game name to start exploring the catalog.
                    </p>
                </div>
            )}
        </div>
    );
}