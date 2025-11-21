//El ToastContext gestiona todas las notificaciones emergentes de la aplicacion, permitiendo mostrar mensajes de exito, 
// error o informacion desde cualquier componente. Mantiene una lista de toasts activos, los muestra automaticamente y los elimina despues 
// de un tiempo configurable o al cerrarlos manualmente. De esta forma, centraliza el sistema de alertas y evita repetir logica en cada modulo.

import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  function pushToast(toast) {
    const id = Date.now();
    const t = {
      id,
      mensaje: toast.mensaje ?? toast.body ?? toast.title ?? "",
      tipo: toast.tipo ?? "info",
      duracion: toast.duracion ?? 4000,
      mostrar: true,
      onCerrar: () => removeToast(id)
    };

    setToasts((tarr) => [...tarr, t]);

    if (t.duracion > 0) {
      setTimeout(() => removeToast(id), t.duracion);
    }
  }

  function clearToasts() {
    setToasts([]);
  }

  function success(mensaje, duracion) {
    pushToast({ mensaje, tipo: "success", duracion });
  }

  function error(mensaje, duracion) {
    pushToast({ mensaje, tipo: "error", duracion });
  }

  return (
    <ToastContext.Provider value={{ pushToast, clearToasts, success, error }}>
      {children}
      <div aria-live="polite" className="toast-container position-fixed bottom-0 end-0 p-3">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;

