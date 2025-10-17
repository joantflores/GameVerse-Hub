import { useEffect, useState } from "react";
import { getEstadisticas } from "../services/dataService";

export default function Estadisticas() {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        getEstadisticas().then(setStats);
    }, []);

    return (
        <div className="container">
            <h2>Estadísticas de Jugadores</h2>
            <table className="table table-striped mt-3">
                <thead className="table-dark">
                    <tr>
                        <th>Jugador</th>
                        <th>Partidas</th>
                        <th>Victorias</th>
                        <th>% de Victorias</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map(j => (
                        <tr key={j.id}>
                            <td>{j.jugador}</td>
                            <td>{j.partidas}</td>
                            <td>{j.victorias}</td>
                            <td>
                                <div className="progress">
                                    <div
                                        className="progress-bar bg-success"
                                        role="progressbar"
                                        style={{ width: `${(j.victorias / j.partidas) * 100}%` }}
                                        aria-valuenow={(j.victorias / j.partidas) * 100}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {Math.round((j.victorias / j.partidas) * 100)}%
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
