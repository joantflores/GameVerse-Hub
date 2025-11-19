import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const BASE_API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function backendUrl(path) {
    if (!BASE_API) return path;
    return `${BASE_API}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function registrarUsuario(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (displayName) {
            await updateProfile(user, { displayName });
        }

        await setDoc(doc(db, "usuarios", user.uid), {
            email: user.email,
            displayName: displayName || user.email,
            fechaRegistro: new Date(),
            favoritos: [],
            historialBusquedas: [],
            historialTrivia: [],
            welcomeSent: false
        });

        await signOut(auth);

        return { success: true, user };

    } catch (error) {
        console.error("Error registering user:", error);
        return { success: false, error: error.message };
    }
}

export async function iniciarSesion(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Cargar datos del usuario
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();

            // Enviar correo de bienvenida solo una vez
            if (!data.welcomeSent) {
                try {
                    const sendUrl = backendUrl("/api/mail/send-welcome");

                    await fetch(sendUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...(import.meta.env.VITE_MAIL_SECRET
                                ? { "x-mail-secret": import.meta.env.VITE_MAIL_SECRET }
                                : {})
                        },
                        body: JSON.stringify({
                            email: user.email,
                            displayName: user.displayName || data.displayName || ""
                        })
                    });

                    // Actualizar Firestore
                    await updateDoc(userRef, { welcomeSent: true });

                } catch (sendErr) {
                    console.error("Failed to send welcome email:", sendErr);
                }
            }
        }

        return { success: true, user };

    } catch (error) {
        console.error("Error signing in:", error);
        return { success: false, error: error.message };
    }
}

export async function cerrarSesion() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export function observarAutenticacion(callback) {
    return onAuthStateChanged(auth, callback);
}

export async function obtenerUsuario(uid) {
    try {
        const snap = await getDoc(doc(db, "usuarios", uid));
        if (snap.exists()) {
            return { success: true, data: snap.data() };
        }
        return { success: false, error: "User not found" };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
