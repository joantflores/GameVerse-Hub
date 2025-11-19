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
        });

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


export async function iniciarSesion(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Load Firestore user data
        const userRef = doc(db, "usuarios", user.uid);
        const userSnap = await getDoc(userRef);

        // No longer send welcome email

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
