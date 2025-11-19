import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const BASE_API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

function backendUrl(path) {
  if (!BASE_API) return path;
  return `${BASE_API}${path.startsWith("/") ? "" : "/"}${path}`;
}

function mapFirebaseError(error) {
  const code = (error && error.code) || "";
  // Normalize a few common firebase v9 error codes into friendly keys
  if (code.includes("auth/email-already-in-use")) {
    return { key: "email-already-in-use", message: "Ya existe una cuenta con ese correo." };
  }
  if (code.includes("auth/invalid-email")) {
    return { key: "invalid-email", message: "El correo no es válido." };
  }
  if (code.includes("auth/weak-password")) {
    return { key: "weak-password", message: "La contraseña debe tener al menos 6 caracteres." };
  }
  if (code.includes("auth/user-not-found") || code.includes("auth/wrong-password")) {
    return { key: "wrong-credentials", message: "Correo o contraseña incorrectos." };
  }
  if (code.includes("auth/too-many-requests")) {
    return { key: "too-many-requests", message: "Demasiados intentos. Intenta más tarde." };
  }
  // fallback
  return { key: "unknown", message: error.message || "Ocurrió un error. Intenta de nuevo." };
}

export async function registrarUsuario(email, password, nombre) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // update display name
    if (nombre) {
      try {
        await updateProfile(user, { displayName: nombre });
      } catch (e) {
        console.warn("No se pudo actualizar el perfil:", e);
      }
    }

    // save to Firestore
    try {
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        email: user.email,
        nombre: nombre || user.displayName || "",
        creadoEn: new Date().toISOString(),
      });
    } catch (e) {
      console.warn("No se pudo crear doc de usuario:", e);
    }

    // send Firebase verification email (this goes from Firebase to user's inbox)
    try {
      await sendEmailVerification(user);
    } catch (e) {
      console.warn("No se pudo enviar email de verificación:", e);
    }

    // optional: call backend to send a custom welcome email if BASE_API is configured
    if (BASE_API) {
      try {
        fetch(backendUrl("/send-welcome-email"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid, email: user.email, nombre }),
        }).catch((err) => console.warn("No se pudo llamar al backend de welcome:", err));
      } catch (e) {
        console.warn("Error al pedir welcome email al backend:", e);
      }
    }

    return { success: true, user };
  } catch (error) {
    const friendly = mapFirebaseError(error);
    return { success: false, code: friendly.key, message: friendly.message, raw: error };
  }
}

export async function iniciarSesion(email, password) {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: cred.user };
  } catch (error) {
    const friendly = mapFirebaseError(error);
    return { success: false, code: friendly.key, message: friendly.message, raw: error };
  }
}

export async function cerrarSesion() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message || "No se pudo cerrar sesión." };
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
