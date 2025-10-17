import { useEffect, useState } from "react";
import { getTrivia } from "../services/dataService";

export default function Trivia() {
    const [preguntas, setPreguntas] = useState([]);
    const [indice, setIndice] = useState(0);
    const [puntaje, setPuntaje] = useState(0);
    const [seleccion, setSeleccion] = useState(null);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        getTrivia().then(setPreguntas);
    }, []);

    const handleRespuesta = (i) => {
        setSeleccion(i);
        if (preguntas[indice] && i === preguntas[indice].correcta) {
            setPuntaje((p) => p + 1);
            setFeedback("¡Correcto!");
        } else {
            setFeedback("Incorrecto");
        }
    };

    const siguientePregunta = () => {
        setSeleccion(null);
        setFeedback("");
        setIndice((prev) => prev + 1);
    };

    if (preguntas.length === 0) {
        return <div className="container mt-4">Cargando trivia...</div>;
    }

    // ⚠️ Cuando ya terminan las preguntas
    if (indice >= preguntas.length) {
        return (
            <div className="container mt-4 text-center">
                <h3>🎉 Trivia completada</h3>
                <p>Puntaje final: {puntaje}/{preguntas.length}</p>
                <button className="btn btn-primary mt-3" onClick={() => {
                    setIndice(0);
                    setPuntaje(0);
                }}>
                    Reiniciar Trivia
                </button>
            </div>
        );
    }

    // ✅ Obtenemos la pregunta actual de forma segura
    const preguntaActual = preguntas[indice];
    if (!preguntaActual || !preguntaActual.opciones) {
        return <div className="container">Cargando pregunta...</div>;
    }

    return (
        <div className="container mt-4">
            <h2>Trivia</h2>
            <div className="card mt-3 p-3">
                <h5>{preguntaActual.pregunta}</h5>

                <div className="mt-3">
                    {preguntaActual.opciones.map((op, i) => (
                        <button
                            key={i}
                            className={`btn m-1 ${seleccion === i
                                    ? i === preguntaActual.correcta
                                        ? "btn-success"
                                        : "btn-danger"
                                    : "btn-outline-primary"
                                }`}
                            onClick={() => handleRespuesta(i)}
                            disabled={seleccion !== null}
                        >
                            {op}
                        </button>
                    ))}
                </div>

                {feedback && <p className="mt-2">{feedback}</p>}
                {seleccion !== null && indice < preguntas.length - 1 && (
                    <button
                        className="btn btn-warning mt-2"
                        onClick={siguientePregunta}
                    >
                        Siguiente pregunta
                    </button>
                )}
            </div>
            <p className="mt-3">Puntaje: {puntaje}</p>
        </div>
    );
}
