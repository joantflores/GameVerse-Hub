# GameVerse Hub

Aplicación de catálogo de videojuegos con integración a IGDB.

## 🚀 Inicio Rápido

### Instalación (solo la primera vez)

```bash
# Instalar dependencias de la raíz (incluye concurrently)
npm install

# Instalar dependencias de backend y frontend
npm run install:all
```

### Ejecutar la aplicación

**Opción 1: Ejecutar backend y frontend juntos (recomendado)**
```bash
npm run dev
```

**Opción 2: Ejecutar por separado**

Terminal 1 - Backend:
```bash
npm run dev:backend
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

## 📋 Scripts Disponibles

### Desde la raíz del proyecto:

- `npm run install:all` - Instala dependencias de backend y frontend
- `npm run install:backend` - Instala solo dependencias del backend
- `npm run install:frontend` - Instala solo dependencias del frontend
- `npm run dev` - Ejecuta backend y frontend simultáneamente
- `npm run dev:backend` - Ejecuta solo el backend (puerto 3000)
- `npm run dev:frontend` - Ejecuta solo el frontend (puerto 5173)

### Desde las carpetas individuales:

**Backend:**
```bash
cd backend
npm install    # Solo la primera vez
npm start     # Ejecutar servidor
```

**Frontend:**
```bash
cd frontend
npm install   # Solo la primera vez
npm run dev   # Ejecutar aplicación
```

## 🔧 Configuración

Asegúrate de tener un archivo `.env` en la carpeta `backend/` con:

```
TWITCH_CLIENT_ID=tu_client_id
TWITCH_CLIENT_SECRET=tu_client_secret
PORT=3000
```

## 📡 Endpoints

- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- API de juegos: `GET http://localhost:3000/api/juegos?nombre=<nombre_del_juego>`

