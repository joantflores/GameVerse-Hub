# Configuración de Firebase para GameVerse Hub

Este proyecto utiliza Firebase Authentication y Firestore para la gestión de usuarios y persistencia de datos.

## Pasos para configurar Firebase

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto" o selecciona un proyecto existente
3. Sigue los pasos del asistente:
   - Ingresa el nombre del proyecto (ej: `gameverse-hub`)
   - Opcionalmente, desactiva Google Analytics (o déjalo activo)
   - Haz clic en "Crear proyecto"

### 2. Habilitar Authentication

1. En el menú lateral, ve a **Authentication**
2. Haz clic en **Comenzar**
3. En la pestaña **Sign-in method**, habilita:
   - **Correo electrónico/Contraseña** (Email/Password)
   - Activa "Correo electrónico/Contraseña" y guarda

### 3. Configurar Firestore Database

1. En el menú lateral, ve a **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona el modo de producción
4. Elige una ubicación para la base de datos (recomendado: cercana a tus usuarios)
5. Haz clic en **Habilitar**

### 4. Configurar reglas de seguridad de Firestore

En Firestore Database, ve a la pestaña **Reglas** y actualiza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo los usuarios autenticados pueden leer/escribir sus propios datos
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Registrar aplicación web

1. En **Configuración del proyecto** (⚙️) > **Configuración general**
2. En "Tus aplicaciones", haz clic en el icono de web (</>)
3. Registra tu app con un nickname (ej: "GameVerse Hub Web")
4. Copia los valores de configuración

### 6. Configurar variables de entorno

1. Copia `.env.example` a `.env` en la carpeta `frontend/`
2. Pega los valores de configuración de Firebase:

```env
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-messaging-sender-id
VITE_FIREBASE_APP_ID=tu-app-id
```

### 7. Estructura de datos en Firestore

El proyecto crea automáticamente la siguiente estructura:

**Colección: `usuarios`**
- Documento ID: `userId` (UID del usuario)
- Campos:
  - `email`: string
  - `displayName`: string
  - `fechaRegistro`: timestamp
  - `favoritos`: array de objetos (juegos favoritos)
  - `historialBusquedas`: array de objetos (búsquedas recientes)
  - `historialTrivia`: array de objetos (resultados de trivia)

### 8. Verificar instalación

1. Instala las dependencias: `npm install` (ya debería estar instalado Firebase)
2. Inicia el servidor de desarrollo: `npm run dev`
3. Ve a la página de registro (`/registro`)
4. Crea una cuenta de prueba
5. Verifica en Firebase Console que se creó el usuario en Authentication y el documento en Firestore

## Solución de problemas

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que todas las variables de entorno estén correctamente configuradas en `.env`
- Asegúrate de que el archivo `.env` esté en la carpeta `frontend/`
- Reinicia el servidor de desarrollo después de modificar `.env`

### Error al acceder a Firestore
- Verifica que Firestore esté habilitado en Firebase Console
- Verifica las reglas de seguridad de Firestore
- Asegúrate de que el usuario esté autenticado antes de acceder a Firestore

### No se guardan los favoritos
- Verifica que el usuario esté autenticado
- Revisa la consola del navegador para ver errores
- Verifica las reglas de seguridad de Firestore

## Recursos adicionales

- [Documentación de Firebase Auth](https://firebase.google.com/docs/auth)
- [Documentación de Firestore](https://firebase.google.com/docs/firestore)
- [Firebase Console](https://console.firebase.google.com/)

