// Función legacy (ya no se usa en producción, pero se mantiene por compatibilidad)
export function getTrivia() {
    return new Promise((resolve) => setTimeout(() => resolve(triviaData), 300));
}

// Helper para validar responses
async function fetchJson(url) {
    const res = await fetch(url);
    const text = await res.text();
    // Intentar parsear JSON, si falla arrojar con info
    try {
        const data = text ? JSON.parse(text) : null;
        if (!res.ok) {
            // Si el servidor responde con error, incluir cuerpo para debugging
            const err = new Error(`HTTP ${res.status} ${res.statusText}`);
            err.status = res.status;
            err.body = data ?? text;
            throw err;
        }
        return data;
    } catch (parseErr) {
        // Error al parsear JSON: devolver detalles para depuración
        const err = new Error("Invalid JSON response from " + url);
        err.original = parseErr;
        err.bodyText = text;
        throw err;
    }
}

// Base URL for backend API (in production set VITE_API_URL in env)
const BASE_API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function apiUrl(path) {
    // normalize
    const base = BASE_API || '';
    if (!base) return path; // relative paths in dev
    // if base already contains '/api' and path starts with '/api', avoid duplication
    const baseHasApi = base.endsWith('/api');
    const pathHasApi = path.startsWith('/api');
    if (baseHasApi && pathHasApi) {
        return base + path.slice(4);
    }
    // ensure single slash join
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Funciones de Catálogo (IGDB API)
export async function getJuegos(nombre, opciones = {}) {
    try {
        const { limit = 20, offset = 0 } = opciones;
        const params = new URLSearchParams({
            nombre: nombre.trim(),
            limit: limit.toString(),
            offset: offset.toString()
        });
        const data = await fetchJson(apiUrl(`/api/juegos?${params.toString()}`));
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Error obteniendo juegos:", err);
        return [];
    }
}

export async function obtenerDetalleJuego(id) {
    try {
        const data = await fetchJson(apiUrl(`/api/juegos/${id}`));
        return data;
    } catch (err) {
        console.error("Error obteniendo detalle del juego:", err);
        throw err;
    }
}

export async function obtenerGeneros() {
    try {
        const data = await fetchJson(apiUrl(`/api/juegos/recursos/generos`));
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Error obteniendo géneros:", err);
        return [];
    }
}

export async function obtenerPlataformas() {
    try {
        const data = await fetchJson(apiUrl(`/api/juegos/recursos/plataformas`));
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Error obteniendo plataformas:", err);
        return [];
    }
}

// Funciones de Trivia (Open Trivia API)
export async function getPreguntasTrivia(opciones = {}) {
    try {
        const { cantidad = 10, categoria = null, dificultad = null, tipo = "multiple" } = opciones;
        
        const params = new URLSearchParams({ cantidad: cantidad.toString(), tipo });
        if (categoria) params.append("categoria", categoria);
        if (dificultad) params.append("dificultad", dificultad);
        
        const url = apiUrl(`/api/trivia/preguntas?${params.toString()}`);
        const data = await fetchJson(url);
        
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Error obteniendo preguntas de trivia:", err);
        throw err;
    }
}

export async function getCategoriasTrivia() {
    try {
        const data = await fetchJson(apiUrl(`/api/trivia/categorias`));
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Error obteniendo categorías de trivia:", err);
        return [];
    }
}
