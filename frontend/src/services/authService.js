import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// URL del backend desde variables de entorno (Render)
const BASE_API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function backendUrl(path) {
    if (!BASE_API) return path;
    return `${BASE_API}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ------------------------------------------------------------
// REGISTRO DE USUARIO
// ------------------------------------------------------------
export async function registrarUsuario(email, password, displayName) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (displayName) {
            await updateProfile(user, { displayName });
        }

        // Crear documento del usuario en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
            email: user.email,
            displayName: displayName || user.email,
            fechaRegistro: new Date(),
            favoritos: [],
            historialBusquedas: [],
            historialTrivia: [],

            // 👇 PARA CONTROLAR EL PRIMER LOGIN
            hasLoggedInBefore: false
        });

        // Cerrar sesión para que el usuario luego haga login normal
        await signOut(auth);

        return { success: true, user };

    } catch (error) {
        console.error("Error registering user:", error);
        let errorMessage = "Failed to register. Please try again.";
        if (error.code === "auth/email-already-in-use") {
            errorMessage = "An account with this email already exists.";
        } else if (error.code === "auth/weak-password") {
            errorMessage = "Password is too weak. Please choose a stronger password.";
        } else if (error.code === "auth/invalid-email") {
            errorMessage = "The email address is not valid.";
        }
        return { success: false, error: errorMessage };
    }
}

// ------------------------------------------------------------
// INICIAR SESIÓN + ENVÍO DE EMAIL EN PRIMER LOGIN
// ------------------------------------------------------------
export async function iniciarSesion(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = doc(db, "usuarios", user.uid);
        const snap = await getDoc(userRef);

        // Si existe y es la primera vez que hace login
        if (snap.exists() && snap.data().hasLoggedInBefore === false) {
            try {
                await fetch(backendUrl("/mail/send-welcome"), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-mail-secret": import.meta.env.VITE_MAIL_SECRET || ""
                    },
                    body: JSON.stringify({
                        email: user.email,
                        displayName: snap.data().displayName
                    })
                });

                console.log("Correo de bienvenida enviado.");
            } catch (err) {
                console.error("Error al enviar correo:", err);
            }

            // Actualizar Firestore para que no vuelva a enviarse
            await updateDoc(userRef, {
                hasLoggedInBefore: true
            });
        }

        return { success: true, user };

    } catch (error) {
        console.error("Error signing in:", error);
        let errorMessage = "Failed to sign in. Please try again.";
        if (error.code === "auth/invalid-email") {
            errorMessage = "The email address is not valid.";
        } else if (error.code === "auth/user-disabled") {
            errorMessage = "This user account has been disabled.";
        } else if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
            errorMessage = "Incorrect email or password.";
        }
        return { success: false, error: errorMessage };
    }
}

// ------------------------------------------------------------
// CERRAR SESIÓN
// ------------------------------------------------------------
export async function cerrarSesion() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ------------------------------------------------------------
// OBSERVAR ESTADO DE AUTENTICACIÓN
// ------------------------------------------------------------
export function observarAutenticacion(callback) {
    return onAuthStateChanged(auth, callback);
}

// ------------------------------------------------------------
// OBTENER USUARIO DESDE FIRESTORE
// ------------------------------------------------------------
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
