# 🔒 Guía de Seguridad - GameVerse Hub

## ⚠️ IMPORTANTE: Archivos .env

**NUNCA subas archivos `.env` al repositorio Git**. Estos archivos contienen credenciales sensibles y representan un riesgo de seguridad crítico.

## ✅ Verificación de Seguridad

Antes de hacer commit, verifica:

1. **No hay archivos .env en el repositorio**
   ```bash
   git status
   # No debe aparecer ningún archivo .env
   ```

2. **Los archivos .env están en .gitignore**
   - Verifica que `.env` esté en `.gitignore` (raíz)
   - Verifica que `.env` esté en `backend/.gitignore`
   - Verifica que `.env` esté en `frontend/.gitignore`

3. **No hay credenciales hardcodeadas en el código**
   - Revisa que no haya API keys, tokens o passwords en el código fuente
   - Todas las credenciales deben venir de variables de entorno

## 📋 Configuración de Variables de Entorno

### Backend

1. Copia el archivo de ejemplo:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edita `.env` con tus credenciales reales:
   ```env
   TWITCH_CLIENT_ID=tu_client_id_real
   TWITCH_CLIENT_SECRET=tu_client_secret_real
   STEAM_API_KEY=tu_steam_api_key_real
   PORT=3000
   ```

3. **IMPORTANTE**: El archivo `.env` ya está en `.gitignore`, así que NO será subido al repositorio.

### Frontend

1. Copia el archivo de ejemplo:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Edita `.env` con tus credenciales de Firebase:
   ```env
   VITE_FIREBASE_API_KEY=tu_firebase_api_key_real
   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_real
   VITE_FIREBASE_APP_ID=tu_app_id_real
   ```

3. **IMPORTANTE**: El archivo `.env` ya está en `.gitignore`, así que NO será subido al repositorio.

## 🚀 Despliegue en Producción

### Variables de Entorno en el Servidor

**NO** subas archivos `.env` al servidor directamente. En su lugar:

#### Backend (Railway, Heroku, etc.)
1. Ve al panel de configuración de tu hosting
2. Agrega las variables de entorno como "Environment Variables" o "Config Vars"
3. Configura cada variable individualmente:
   - `TWITCH_CLIENT_ID`
   - `TWITCH_CLIENT_SECRET`
   - `STEAM_API_KEY`
   - `PORT`

#### Frontend (Vercel, Netlify, Firebase Hosting)
1. Ve al panel de configuración de tu hosting
2. En "Environment Variables" o "Build Environment Variables"
3. Agrega cada variable con el prefijo `VITE_`:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## 🔍 Verificar que no hay archivos .env en Git

Ejecuta estos comandos para verificar:

```bash
# Verificar archivos .env que estén siendo trackeados
git ls-files | grep .env

# Si aparece algún archivo .env, significa que está siendo trackeado
# Debes eliminarlo del repositorio (pero mantenerlo localmente):
git rm --cached backend/.env
git rm --cached frontend/.env
git commit -m "Eliminar archivos .env del repositorio"
```

## 📝 Archivos .env.example

Los archivos `.env.example` **SÍ** deben estar en el repositorio. Estos son plantillas seguras que:
- No contienen credenciales reales
- Documentan qué variables de entorno se necesitan
- Sirven como guía para otros desarrolladores

## ✅ Checklist Antes de Commit

- [ ] No hay archivos `.env` en `git status`
- [ ] Los archivos `.env` están en `.gitignore`
- [ ] Los archivos `.env.example` existen y están actualizados
- [ ] No hay credenciales hardcodeadas en el código
- [ ] No hay `console.log` que expongan tokens o secrets
- [ ] Todas las credenciales vienen de `process.env` o `import.meta.env`

## 🔐 Buenas Prácticas

1. **Nunca hardcodees credenciales** en el código
2. **Usa variables de entorno** para todas las credenciales
3. **Documenta** las variables necesarias en `.env.example`
4. **Revisa** cada commit antes de hacer push
5. **Rotar credenciales** si accidentalmente se expusieron

## ⚠️ Si accidentalmente subiste un .env

1. **Rotar inmediatamente** todas las credenciales expuestas
2. Eliminar el archivo del repositorio:
   ```bash
   git rm --cached archivo.env
   git commit -m "Eliminar archivo .env expuesto"
   git push
   ```
3. Limpiar el historial de Git (si es necesario) usando `git filter-branch` o herramientas especializadas

