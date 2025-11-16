import { createContext, useContext, useEffect, useState } from "react";
import { observarAutenticacion, obtenerUsuario } from "../services/authService";

const AuthContext = createContext();

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de AuthProvider");
    }
    return context;
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [userData, setUserData] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const unsubscribe = observarAutenticacion(async (user) => {
            setUsuario(user);
            if (user) {
                // Obtener datos adicionales del usuario desde Firestore
                const result = await obtenerUsuario(user.uid);
                if (result.success) {
                    setUserData(result.data);
                }
            } else {
                setUserData(null);
            }
            setCargando(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        usuario,
        userData,
        cargando,
        setUserData // Para actualizar datos del usuario cuando cambien
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

