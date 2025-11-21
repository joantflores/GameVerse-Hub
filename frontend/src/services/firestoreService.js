// Este modulo gestiona toda la informacion personalizada del usuario en Firestore,
// incluyendo favoritos, historial de busquedas y resultados de trivia. Gracias a estas
// funciones, el sistema puede guardar y recuperar las acciones del usuario, mantener
// persistencia entre sesiones y ofrecer una experiencia personalizada dentro del proyecto.

import { 
    doc, 
    getDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    Timestamp 
} from "firebase/firestore";
import { db } from "../config/firebase";

// Obtener favoritos del usuario
export async function obtenerFavoritos(uid) {
    try {
        const userDoc = await getDoc(doc(db, "usuarios", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return { success: true, favoritos: userData.favoritos || [] };
        }
        return { success: false, favoritos: [] };
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        return { success: false, favoritos: [], error: error.message };
    }
}

// Agregar juego a favoritos
export async function agregarFavorito(uid, juego) {
    try {
        const userRef = doc(db, "usuarios", uid);
        const userDoc = await getDoc(userRef);
        
        const favoritosActuales = userDoc.data()?.favoritos || [];
        
        // Verificar si ya existe
        const existe = favoritosActuales.some(f => f.id === juego.id);
        if (existe) {
            return { success: false, error: "El juego ya está en favoritos" };
        }

        // Agregar con fecha
        const juegoConFecha = {
            ...juego,
            fechaAgregado: Timestamp.now()
        };

        await updateDoc(userRef, {
            favoritos: arrayUnion(juegoConFecha)
        });

        return { success: true };
    } catch (error) {
        console.error("Error al agregar favorito:", error);
        return { success: false, error: error.message };
    }
}

// Eliminar juego de favoritos
export async function eliminarFavorito(uid, juegoId) {
    try {
        const userRef = doc(db, "usuarios", uid);
        const userDoc = await getDoc(userRef);
        
        const favoritosActuales = userDoc.data()?.favoritos || [];
        const juegoAEliminar = favoritosActuales.find(f => f.id === juegoId);
        
        if (!juegoAEliminar) {
            return { success: false, error: "El juego no está en favoritos" };
        }

        await updateDoc(userRef, {
            favoritos: arrayRemove(juegoAEliminar)
        });

        return { success: true };
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
        return { success: false, error: error.message };
    }
}

// Agregar busqueda al historial
export async function agregarHistorialBusqueda(uid, busqueda) {
    try {
        const userRef = doc(db, "usuarios", uid);
        const userDoc = await getDoc(userRef);
        
        const historialActual = userDoc.data()?.historialBusquedas || [];
        
        // Agregar al inicio y limitar a 20 busquedas
        const nuevoHistorial = [
            {
                busqueda,
                fecha: Timestamp.now()
            },
            ...historialActual
        ].slice(0, 20);

        await updateDoc(userRef, {
            historialBusquedas: nuevoHistorial
        });

        return { success: true };
    } catch (error) {
        console.error("Error al agregar historial de búsqueda:", error);
        return { success: false, error: error.message };
    }
}

// Agregar resultado de trivia al historial
export async function agregarHistorialTrivia(uid, resultadoTrivia) {
    try {
        const userRef = doc(db, "usuarios", uid);
        const userDoc = await getDoc(userRef);
        
        const historialActual = userDoc.data()?.historialTrivia || [];
        
        const nuevoHistorial = [
            {
                ...resultadoTrivia,
                fecha: Timestamp.now()
            },
            ...historialActual
        ].slice(0, 50);

        await updateDoc(userRef, {
            historialTrivia: nuevoHistorial
        });

        return { success: true };
    } catch (error) {
        console.error("Error al agregar historial de trivia:", error);
        return { success: false, error: error.message };
    }
}

// Obtener historial de busquedas
export async function obtenerHistorialBusquedas(uid) {
    try {
        const userDoc = await getDoc(doc(db, "usuarios", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return { success: true, historial: userData.historialBusquedas || [] };
        }
        return { success: false, historial: [] };
    } catch (error) {
        console.error("Error al obtener historial:", error);
        return { success: false, historial: [], error: error.message };
    }
}

// Obtener historial de trivia
export async function obtenerHistorialTrivia(uid) {
    try {
        const userDoc = await getDoc(doc(db, "usuarios", uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return { success: true, historial: userData.historialTrivia || [] };
        }
        return { success: false, historial: [] };
    } catch (error) {
        console.error("Error al obtener historial de trivia:", error);
        return { success: false, historial: [], error: error.message };
    }
}