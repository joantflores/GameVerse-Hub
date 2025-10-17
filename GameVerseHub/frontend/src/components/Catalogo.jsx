import { useEffect, useState } from "react";
import { getCatalogo } from "../services/dataService";

export default function Catalogo() {
    const [juegos, setJuegos] = useState([]);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        getCatalogo().then(setJuegos);
    }, []);

    const filtrados = juegos.filter(j => j.nombre.toLowerCase().includes(filtro.toLowerCase()) || j.genero.toLowerCase().includes(filtro.toLowerCase()));

    return (
        <div className="container">
            <h2>Catálogo de Juegos</h2>
            <input className="form-control mb-3" placeholder="Buscar juego..." value={filtro} onChange={e => setFiltro(e.target.value)} />
            <div className="row">
                {filtrados.map(j => (
                    <div className="col-md-4 mb-3" key={j.id}>
                        <div className="card">
                            <img src={j.img} className="card-img-top" alt={j.nombre} />
                            <div className="card-body">
                                <h5 className="card-title">{j.nombre}</h5>
                                <p className="card-text">{j.descripcion}</p>
                                <span className="badge bg-primary">{j.genero}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
