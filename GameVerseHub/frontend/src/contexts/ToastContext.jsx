import React, { createContext, useContext, useState } from "react";
import Toast from "../components/Toast";

// Sólo exporta contexto y provider (componentes)
const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function pushToast(toast) {
    setToasts((t) => [...t, { id: Date.now(), ...toast }]);
    // auto-remove after 4s
    setTimeout(() => {
      setToasts((t) => t.slice(1));
    }, 4000);
  }

  function clearToasts() {
    setToasts([]);
  }

  return (
    <ToastContext.Provider value={{ pushToast, clearToasts }}>
      {children}
      <div aria-live="polite" className="toast-container position-fixed bottom-0 end-0 p-3">
        {toasts.map((t) => <Toast key={t.id} {...t} />)}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastContext;

