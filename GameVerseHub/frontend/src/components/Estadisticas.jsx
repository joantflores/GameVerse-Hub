// Estadisticas.jsx
import React, { useEffect, useState } from "react";

// Datos de ejemplo
const estadisticasFicticias = [
    { jugador: "Alice", partidas_jugadas: 120, victorias: 85 },
    { jugador: "Bob", partidas_jugadas: 95, victorias: 50 },
    { jugador: "Charlie", partidas_jugadas: 150, victorias: 100 },
];

export default function Estadisticas() {
    const [estadisticas, setEstadisticas] = useState([]);

    // Simular carga de datos
    useEffect(() => {
        // Aquí podrías reemplazarlo con fetch si fuera real
        setTimeout(() => {
            setEstadisticas(estadisticasFicticias);
        }, 300); // Simula un pequeño delay
    }, []);

    return (
        <div className="container mt-4">
            <h2>Estadísticas de Jugadores</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Jugador</th>
                        <th>Partidas</th>
                        <th>Victorias</th>
                        <th>% de Victorias</th>
                    </tr>
                </thead>
                <tbody>
                    {estadisticas.map((j, i) => (
                        <tr key={i}>
                            <td>{j.jugador}</td>
                            <td>{j.partidas_jugadas}</td>
                            <td>{j.victorias}</td>
                            <td>
                                {j.partidas_jugadas > 0
                                    ? ((j.victorias / j.partidas_jugadas) * 100).toFixed(1) + "%"
                                    : "0%"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
