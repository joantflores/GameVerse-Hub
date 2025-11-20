import React, { useState, useEffect } from "react";
import { getPreguntasTrivia } from "../services/dataService.js";
import { useAuth } from "../contexts/AuthContext";
import { agregarHistorialTrivia } from "../services/firestoreService";

export default function Trivia() {
    const { usuario } = useAuth();
    const [preguntas, setPreguntas] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [indice, setIndice] = useState(0);
    const [puntaje, setPuntaje] = useState(0);
    const [seleccion, setSeleccion] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [mostrarConfiguracion, setMostrarConfiguracion] = useState(true);
    const [configuracion, setConfiguracion] = useState({
        cantidad: 10,
        dificultad: "" // "" = Any Difficulty
    });
    const [juegoTerminado, setJuegoTerminado] = useState(false);

    useEffect(() => {
        if (usuario && juegoTerminado && preguntas.length > 0) {
            const porcentaje = ((puntaje / preguntas.length) * 100).toFixed(0);
            agregarHistorialTrivia(usuario.uid, {
                puntaje,
                totalPreguntas: preguntas.length,
                porcentaje: parseFloat(porcentaje),
                dificultad: configuracion.dificultad || "mixed",
                fecha: new Date().toISOString()
            }).catch(err => console.error("Error saving trivia history:", err));
        }
    }, [juegoTerminado, usuario, preguntas, puntaje, configuracion.dificultad]);

    const iniciarTrivia = async () => {
        setCargando(true);
        setPreguntas([]);
        setIndice(0);
        setPuntaje(0);
        setSeleccion(null);
        setFeedback("");
        setJuegoTerminado(false);
        setMostrarConfiguracion(false);

        try {
            const opciones = {
                cantidad: configuracion.cantidad,
                dificultad: configuracion.dificultad || null
            };

            let preguntasObtenidas = await getPreguntasTrivia(opciones);
            if (!Array.isArray(preguntasObtenidas)) preguntasObtenidas = [];

            preguntasObtenidas = preguntasObtenidas.slice(0, configuracion.cantidad);
            setPreguntas(preguntasObtenidas);

            if (preguntasObtenidas.length === 0) {
                alert("Could not fetch questions with that configuration. Please try again.");
                setMostrarConfiguracion(true);
            }
        } catch (err) {
            console.error("Error loading questions:", err);
            alert("Error loading questions. Please try again.");
            setMostrarConfiguracion(true);
        } finally {
            setCargando(false);
        }
    };

    const handleRespuesta = (i) => {
        if (seleccion !== null) return;
        setSeleccion(i);
        const preguntaActual = preguntas[indice];
        if (!preguntaActual) return;

        if (i === preguntaActual.correcta) {
            setPuntaje((p) => p + 1);
            setFeedback("Correct! 🎉");
        } else {
            setFeedback(`Incorrect. The correct answer was: "${preguntaActual.respuestaCorrecta ?? 'N/A'}"`);
        }
    };

    const siguientePregunta = () => {
        if (indice < preguntas.length - 1) {
            setSeleccion(null);
            setFeedback("");
            setIndice((prev) => prev + 1);
        } else {
            setJuegoTerminado(true);
        }
    };

    const reiniciarJuego = () => {
        setIndice(0);
        setPuntaje(0);
        setSeleccion(null);
        setFeedback("");
        setJuegoTerminado(false);
        setMostrarConfiguracion(true);
    };

    if (mostrarConfiguracion) {
        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title mb-4">🎮 GameVerse Trivia</h2>
                                <p className="text-muted mb-4">Test your knowledge about video games</p>

                                <div className="mb-3">
                                    <label htmlFor="cantidad" className="form-label">
                                        <strong>Number of questions:</strong> {configuracion.cantidad}
                                    </label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        id="cantidad"
                                        min="5"
                                        max="20"
                                        value={configuracion.cantidad}
                                        onChange={(e) => setConfiguracion({ ...configuracion, cantidad: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="dificultad" className="form-label">
                                        <strong>Difficulty:</strong>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="dificultad"
                                        value={configuracion.dificultad}
                                        onChange={(e) => setConfiguracion({ ...configuracion, dificultad: e.target.value })}
                                    >
                                        <option value="">Any difficulty</option>
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                </div>

                                <button
                                    className="btn btn-primary btn-lg w-100"
                                    onClick={iniciarTrivia}
                                    disabled={cargando}
                                >
                                    {cargando ? "Loading questions..." : "Start Trivia 🚀"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cargando || preguntas.length === 0) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading trivia...</span>
                </div>
                <p className="mt-3">Loading questions...</p>
            </div>
        );
    }

    if (juegoTerminado) {
        const porcentaje = ((puntaje / preguntas.length) * 100).toFixed(0);
        let mensaje = "";
        let emoji = "";
        if (porcentaje >= 80) { mensaje = "Excellent!"; emoji = "🌟"; }
        else if (porcentaje >= 60) { mensaje = "Good!"; emoji = "👍"; }
        else if (porcentaje >= 40) { mensaje = "Not bad"; emoji = "📚"; }
        else { mensaje = "Keep practicing"; emoji = "💡"; }

        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card text-center">
                            <div className="card-body py-5">
                                <h1 className="mb-3">{emoji}</h1>
                                <h3 className="mb-3">🎉 Trivia Completed</h3>
                                <h2 className="mb-3">Score: <strong>{puntaje}</strong> / {preguntas.length}</h2>

                                <div className="progress mb-3" style={{ height: "30px" }}>
                                    <div className={`progress-bar ${
                                        porcentaje >= 80 ? "bg-success" :
                                        porcentaje >= 60 ? "bg-info" :
                                        porcentaje >= 40 ? "bg-warning" : "bg-danger"
                                    }`}
                                        role="progressbar"
                                        style={{ width: `${porcentaje}%` }}>
                                        {porcentaje}%
                                    </div>
                                </div>

                                <p className="h5 mb-4">{mensaje}</p>
                                <button className="btn btn-primary btn-lg me-2" onClick={reiniciarJuego}>Play Again</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const preguntaActual = preguntas[indice];
    if (!preguntaActual || !preguntaActual.opciones) {
        return <div className="container mt-4">Loading question...</div>;
    }

    const porcentajeProgreso = ((indice + 1) / preguntas.length) * 100;

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">

                    {/* Barra de progreso */}
                    <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                            <small className="text-muted">
                                Question {indice + 1} of {preguntas.length}
                            </small>
                            <small className="text-muted">
                                Score: <strong>{puntaje}</strong> / {preguntas.length}
                            </small>
                        </div>
                        <div className="progress" style={{ height: "25px" }}>
                            <div
                                className="progress-bar progress-bar-striped progress-bar-animated"
                                role="progressbar"
                                style={{ width: `${porcentajeProgreso}%` }}
                            >
                                {Math.round(porcentajeProgreso)}%
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-body p-4">

                            {/* Categoría y dificultad */}
                            <div className="d-flex justify-content-between mb-3">
                                <span className="badge bg-secondary">{preguntaActual.categoria}</span>

                                {/* ❗ Mostrar dificultad SOLO si configuracion.dificultad === "" */}
                                {configuracion.dificultad === "" && (
                                    <span className={`badge ${
                                        preguntaActual.dificultad === "easy" ? "bg-success" :
                                        preguntaActual.dificultad === "medium" ? "bg-warning" :
                                        "bg-danger"
                                    }`}>
                                        {preguntaActual.dificultad === "easy" ? "Easy" :
                                        preguntaActual.dificultad === "medium" ? "Medium" : "Hard"}
                                    </span>
                                )}
                            </div>

                            <h4 className="card-title mb-4">{preguntaActual.pregunta}</h4>

                            <div className="row g-2 mb-3">
                                {preguntaActual.opciones.map((op, i) => {
                                    let btnClass = "btn-outline-primary";
                                    if (seleccion !== null) {
                                        if (i === preguntaActual.correcta) {
                                            btnClass = "btn-success";
                                        } else if (i === seleccion && i !== preguntaActual.correcta) {
                                            btnClass = "btn-danger";
                                        } else {
                                            btnClass = "btn-outline-secondary";
                                        }
                                    }

                                    return (
                                        <div key={i} className="col-12 col-md-6">
                                            <button
                                                className={`btn ${btnClass} w-100 py-3 text-start`}
                                                onClick={() => handleRespuesta(i)}
                                                disabled={seleccion !== null}
                                                style={{ minHeight: "60px" }}
                                            >
                                                {op}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {feedback && (
                                <div className={`alert ${seleccion === preguntaActual.correcta ? "alert-success" : "alert-danger"} mb-3`} role="alert">
                                    <strong>{feedback}</strong>
                                </div>
                            )}

                            {seleccion !== null && (
                                <div className="text-center">
                                    <button
                                        className="btn btn-primary btn-lg"
                                        onClick={siguientePregunta}
                                    >
                                        {indice < preguntas.length - 1 ? "Next Question →" : "View Results"}
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
