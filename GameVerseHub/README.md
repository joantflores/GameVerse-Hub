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

**⚠️ IMPORTANTE: Las credenciales de Twitch son OBLIGATORIAS** para que la aplicación funcione. La aplicación usa la API real de IGDB y no funcionará sin credenciales válidas.

### 🔒 Seguridad - Archivo .env

**⚠️ CRÍTICO: NUNCA subas el archivo `.env` al repositorio.** Este archivo contiene credenciales sensibles y está excluido por `.gitignore`. Si accidentalmente lo subiste, elimínalo del historial de Git inmediatamente.

**Verificar que .env no esté en Git:**
```bash
git ls-files | grep .env
# No debe mostrar ningún archivo .env
```

### Para Desarrollo Local (archivo .env)

Crea un archivo `.env` en la carpeta `backend/` con:

```
TWITCH_CLIENT_ID=tu_client_id
TWITCH_CLIENT_SECRET=tu_client_secret
PORT=3000
```

**Para obtener las credenciales:**
1. Ve a https://dev.twitch.tv/console/apps
2. Crea una nueva aplicación
3. Tipo de cliente: **Confidential**
4. Copia el Client ID y Client Secret
5. Pega los valores en tu archivo `.env` (este archivo NO se subirá a Git)

### Para Producción (Variables de Entorno)

**En servidores, NUNCA uses archivos `.env`.** Configura las credenciales como variables de entorno del sistema:
- `TWITCH_CLIENT_ID`
- `TWITCH_CLIENT_SECRET`
- `PORT` (opcional, por defecto 3000)

## 📡 Endpoints

- Backend: http://localhost:3000
- Frontend: http://localhost:5173
- API de juegos: `GET http://localhost:3000/api/juegos?nombre=<nombre_del_juego>`

## 🚀 Deployment en Servidor

### Configuración para Producción

**IMPORTANTE:** En servidores, **NO uses archivos `.env`**. Configura las variables de entorno directamente en el servidor.

### Variables de Entorno Requeridas

Configura estas variables de entorno en tu servidor:

```bash
TWITCH_CLIENT_ID=tu_client_id
TWITCH_CLIENT_SECRET=tu_client_secret
PORT=3000  # Opcional, por defecto 3000
NODE_ENV=production  # Opcional, pero recomendado
```

### Cómo Configurar Variables de Entorno

#### En servidores Linux/Unix:
```bash
export TWITCH_CLIENT_ID=tu_client_id
export TWITCH_CLIENT_SECRET=tu_client_secret
export PORT=3000
```

#### En plataformas de hosting:

**Heroku:**
```bash
heroku config:set TWITCH_CLIENT_ID=tu_client_id
heroku config:set TWITCH_CLIENT_SECRET=tu_client_secret
heroku config:set PORT=3000
```

**Railway:**
- Ve a tu proyecto → Variables → Agrega las variables

**Vercel:**
- Ve a Settings → Environment Variables → Agrega las variables

**Render:**
- Ve a Environment → Add Environment Variable

**DigitalOcean App Platform:**
- Ve a Settings → App-Level Environment Variables

### Build y Deploy

**Backend:**
```bash
cd backend
npm install --production
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Los archivos en 'dist' se sirven desde tu servidor web
```

### Notas Importantes

1. **🔒 SEGURIDAD: El archivo `.env` NUNCA debe estar en el repositorio** - Está excluido por `.gitignore`
2. **En servidores, NUNCA uses archivos `.env`** - Usa variables de entorno del sistema
3. **Prioridad de configuración:**
   - Variables de entorno del sistema (producción) ✅
   - Archivo `.env` (solo desarrollo local, NO se sube a Git)
4. **Las credenciales son OBLIGATORIAS** - La aplicación no funcionará sin ellas
5. **El código detecta automáticamente** si está en producción y usa las variables de entorno del sistema

### 🔒 Verificación de Seguridad Antes de Subir a Git

Antes de hacer commit y push, verifica que ningún archivo `.env` esté siendo rastreado:

```bash
# Verificar archivos .env en Git
git ls-files | grep .env

# Si aparece algún .env, elimínalo del tracking (pero manténlo localmente):
git rm --cached backend/.env
git commit -m "Remove .env from repository for security"
```

**Si accidentalmente subiste un `.env` con credenciales reales:**
1. Elimínalo inmediatamente del repositorio
2. Regenera las credenciales en Twitch (revoca las antiguas)
3. Crea nuevas credenciales

