//Este componente maneja tanto el inicio de sesion como el registro, administrando validacion, estados de carga y manejo de errores. 
// Dependiendo del modo (esRegistro), muestra campos adicionales como el nombre, envia los datos al servicio de autenticacion correspondiente 
// y ofrece retroalimentacion visual mediante alertas y toasts, redirigiendo al usuario tras una autenticación exitosa.

import React, { useState } from "react";
import { iniciarSesion, registrarUsuario } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

export default function Login({ esRegistro = false }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombre, setNombre] = useState("");
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCargando(true);

        try {
            let result;

            if (esRegistro) {
                if (!nombre.trim()) {
                    setError("Name is required");
                    setCargando(false);
                    return;
                }

                result = await registrarUsuario(email, password, nombre);

                if (result.success) {
                    success("Registration successful! Please sign in.");
                    navigate("/login");
                    setEmail("");
                    setPassword("");
                    setNombre("");
                    return;
                }

            } else {
                result = await iniciarSesion(email, password);

                if (result.success) {
                    success("Welcome back!");
                    navigate("/");
                    return;
                }
            }

            const errorMsg = result.error || "Authentication error";
            setError(errorMsg);
            toastError(errorMsg);

        } catch (err) {
            console.error(err);
            setError("Unexpected error. Try again later.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title mb-4 text-center">
                                {esRegistro ? "📝 Sign Up" : "🔐 Sign In"}
                            </h2>

                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {esRegistro && (
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Name</label>
                                        <input
                                            id="nombre"
                                            type="text"
                                            className="form-control"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    {esRegistro && (
                                        <small className="text-muted">
                                            Minimum 6 characters
                                        </small>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-2"
                                    disabled={cargando}
                                >
                                    {cargando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            {esRegistro ? "Signing up..." : "Signing in..."}
                                        </>
                                    ) : (
                                        esRegistro ? "Sign Up" : "Sign In"
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-3">
                                <small>
                                    {esRegistro ? (
                                        <>Already have an account? <a href="/login">Sign in</a></>
                                    ) : (
                                        <>Don’t have an account? <a href="/registro">Sign up</a></>
                                    )}
                                </small>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
