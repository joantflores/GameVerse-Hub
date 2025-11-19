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
  const { success: toastSuccess, error: toastError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      if (esRegistro) {
        const res = await registrarUsuario(email, password, nombre);
        if (!res.success) {
          setError(res.message || "No se pudo registrar");
          toastError?.(res.message || "No se pudo registrar");
          setCargando(false);
          return;
        }
        toastSuccess?.("Registro exitoso. Revisa tu correo para verificar tu cuenta.");
        // after register, you might want to redirect to a verify page or home
        navigate("/");
      } else {
        const res = await iniciarSesion(email, password);
        if (!res.success) {
          setError(res.message || "No se pudo iniciar sesión");
          toastError?.(res.message || "No se pudo iniciar sesión");
          setCargando(false);
          return;
        }
        toastSuccess?.("Bienvenido de nuevo");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error inesperado.");
      toastError?.("Ocurrió un error inesperado.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-md w-full p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl mb-4">{esRegistro ? "Crear cuenta" : "Iniciar sesión"}</h2>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        {esRegistro && (
          <div className="mb-4">
            <label className="block text-sm">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-2 border rounded" />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm">Correo</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <div className="mb-4">
          <label className="block text-sm">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" />
        </div>

        <button type="submit" disabled={cargando} className="w-full py-2 rounded bg-blue-600 text-white">
          {cargando ? (esRegistro ? "Creando..." : "Ingresando...") : (esRegistro ? "Crear cuenta" : "Iniciar sesión")}
        </button>

        <div className="mt-4 text-center text-sm">
          {esRegistro ? (
            <>Already have an account? <a href="/login">Sign in</a></>
          ) : (
            <>Don’t have an account? <a href="/registro">Sign up</a></>
          )}
        </div>
      </form>
    </div>
  );
}
