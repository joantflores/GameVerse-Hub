import { useEffect, useState } from "react";
import { getJuegos } from "../services/dataService.js";

export default function Catalogo() {
    const [juegos, setJuegos] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (filtro.trim() === "") {
            setJuegos([]);
            return;
        }

        setLoading(true);

        const timeoutId = setTimeout(() => {
            getJuegos(filtro).then(data => {
                setJuegos(data);
                setLoading(false);
            });
        }, 500);

        return () => clearTimeout(timeoutId);

    }, [filtro]);

    return (
        <div className="container mt-4">
            <h2>Catálogo de Juegos</h2>
            <input
                className="form-control mb-3"
                placeholder="Buscar juego..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
            />

            {loading && <p>Cargando juegos...</p>}

            <div className="row">
                {juegos.map(j => (
                    <div className="col-md-4 mb-3" key={j.id}>
                        <div className="card">
                            {j.cover?.url && (
                                <img
                                    src={j.cover.url.replace("t_thumb", "t_cover_big")}
                                    className="card-img-top"
                                    alt={j.name}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{j.name}</h5>
                                <p className="card-text">{j.summary}</p>
                                {j.genres?.map(g => (
                                    <span key={g.id} className="badge bg-primary me-1">{g.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}