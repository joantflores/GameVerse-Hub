import { useEffect } from "react";

export default function Toast({ mensaje, tipo = "info", mostrar, onCerrar, duracion = 3000 }) {
    useEffect(() => {
        if (mostrar && duracion > 0) {
            const timer = setTimeout(() => {
                onCerrar();
            }, duracion);

            return () => clearTimeout(timer);
        }
    }, [mostrar, duracion, onCerrar]);

    if (!mostrar) return null;

    const tipoClass = {
        success: "bg-success",
        error: "bg-danger",
        warning: "bg-warning",
        info: "bg-info"
    }[tipo] || "bg-info";

    const icono = {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️"
    }[tipo] || "ℹ️";

    return (
        <div 
            className={`toast show align-items-center text-white ${tipoClass} border-0`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                minWidth: "300px"
            }}
        >
            <div className="d-flex">
                <div className="toast-body">
                    <strong>{icono}</strong> {mensaje}
                </div>
                <button
                    type="button"
                    className="btn-close btn-close-white me-2 m-auto"
                    onClick={onCerrar}
                    aria-label="Close"
                ></button>
            </div>
        </div>
    );
}

