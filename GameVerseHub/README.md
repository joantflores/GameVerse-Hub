# 🎮 GameVerse Hub

Plataforma web integral para gamers que centraliza información de diferentes APIs públicas de videojuegos, ofreciendo un catálogo mundial de videojuegos y dinámicas de trivia interactiva.

## 📋 Características

- **Catálogo de Videojuegos**: Búsqueda y filtrado de juegos usando IGDB API con filtros avanzados
- **Trivia de Videojuegos**: Minijuego de preguntas sobre videojuegos usando Open Trivia API
- **Sistema de Favoritos**: Guarda tus juegos favoritos (requiere autenticación)
- **Historial de Actividad**: Registro de búsquedas y resultados de trivia
- **Dashboard Personalizado**: Resumen de actividad del usuario
- **Vista Detallada de Juegos**: Información completa con screenshots, rating, géneros y más

## 🛠️ Tecnologías

### Frontend
- React 19
- React Router DOM
- Bootstrap 5
- Firebase (Authentication y Firestore)
- Vite

### Backend
- Node.js
- Express 5
- Firebase (Authentication y Firestore)
- APIs externas:
  - IGDB API (Twitch)
  - Open Trivia API

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- Cuentas y API keys para:
  - Twitch Developer (para IGDB)
  - Firebase (Auth y Firestore)

### Configuración

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd GameVerseHub
   ```

2. **Configurar Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con tus credenciales reales
   ```

3. **Configurar Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Editar .env con tus credenciales de Firebase
   ```

4. **Configurar Firebase**
   - Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilitar Authentication (Email/Password)
   - Crear Firestore Database
   - Configurar reglas de seguridad
   - Ver `FIREBASE_SETUP.md` para más detalles

## ⚙️ Variables de Entorno

### Backend (.env)

```env
TWITCH_CLIENT_ID=tu_twitch_client_id
TWITCH_CLIENT_SECRET=tu_twitch_client_secret
PORT=3000
```

### Frontend (.env)

```env
VITE_FIREBASE_API_KEY=tu_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

## 🚀 Ejecución en Desarrollo

### Backend
```bash
cd backend
npm start
# O si tienes un script definido:
node services/index.js
```

El backend correrá en `http://localhost:3000`

### Frontend
```bash
cd frontend
npm run dev
```

El frontend correrá en `http://localhost:5173`

## 🔒 Seguridad

**⚠️ CRÍTICO - LEE ANTES DE HACER COMMIT**: 

- **NUNCA** subas archivos `.env` al repositorio - representa un riesgo de seguridad crítico
- Los archivos `.env` están en `.gitignore` por seguridad (raíz, backend y frontend)
- Usa `.env.example` como plantilla para documentar las variables necesarias
- En producción, configura las variables de entorno directamente en el servidor/hosting
- **Verifica siempre** antes de hacer commit que no hay archivos `.env` en `git status`

### Verificación de Seguridad

Antes de hacer commit, ejecuta:

```bash
git status
# No debe aparecer ningún archivo .env
```

Si aparece algún `.env`, ejecuta:
```bash
git rm --cached backend/.env
git rm --cached frontend/.env
```

Ver `SEGURIDAD.md` y `VERIFICACION_SEGURIDAD.md` para más detalles.

## 📁 Estructura del Proyecto

```
GameVerseHub/
├── backend/
│   ├── services/
│   │   ├── igdbService.js      # Servicio IGDB (Catálogo de juegos)
│   │   ├── triviaService.js    # Servicio Trivia (Open Trivia API)
│   │   └── index.js            # Servidor Express
│   ├── routes/
│   │   └── gameRouter.js       # Rutas API
│   ├── .env.example            # Ejemplo de variables de entorno
│   └── .gitignore              # Ignora archivos sensibles
│
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── Catalogo.jsx    # Catálogo de juegos
│   │   │   ├── Trivia.jsx      # Trivia interactiva
│   │   │   ├── Dashboard.jsx   # Dashboard principal
│   │   │   ├── DetalleJuego.jsx # Vista detallada de juegos
│   │   │   ├── Favoritos.jsx   # Juegos favoritos
│   │   │   └── Login.jsx       # Autenticación
│   │   ├── contexts/           # Context API (Auth, Toast)
│   │   ├── services/           # Servicios de datos
│   │   ├── config/             # Configuración (Firebase)
│   │   └── App.jsx
│   ├── .env.example            # Ejemplo de variables de entorno
│   └── .gitignore              # Ignora archivos sensibles
│
├── .gitignore                  # Gitignore raíz
├── README.md                   # Documentación principal
├── FIREBASE_SETUP.md           # Guía de configuración de Firebase
├── SEGURIDAD.md                # Guía de seguridad
└── VERIFICACION_SEGURIDAD.md   # Checklist de verificación
```

## 🌐 Despliegue

### Backend
- Railway, Heroku, o Firebase Functions
- Configurar variables de entorno en el panel del hosting

### Frontend
- Vercel, Netlify, o Firebase Hosting
- Configurar variables de entorno como "Environment Variables"

## 📝 APIs Utilizadas

1. **IGDB API** (vía Twitch) - Catálogo de videojuegos con búsqueda, filtros y detalles
2. **Open Trivia API** - Preguntas de trivia sobre videojuegos

## 👥 Autor

Proyecto desarrollado para el curso de desarrollo web.

## 📄 Licencia

Este proyecto es de uso educativo.

