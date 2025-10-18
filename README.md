# GameVerse-Hub - Avance

Este proyecto es un catálogo interactivo de videojuegos que, a través de la API de IGDB, posibilita la búsqueda de juegos y la visualización de estadísticas ficticias sobre jugadores. El proyecto se divide en dos partes: el frontend, que utiliza React, y el backend, que emplea Node.js y Express.

## Requisitos Previos

Antes de implementar el proyecto, verifica que las próximas herramientas estén instaladas:

- Node.js versión 18 o superior
- npm igual o superior a 9

- Navegador actualizado (Firefox, Edge, Chrome)
- Una cuenta de Twitch para desarrollar la aplicación que suministra la API de IGDB

## Configuración del Backend

1. Instalar dependencias

```bash
cd backend
npm install

```
2. Crear archivo .env en la carpeta backend/. El archivo debe contener:

```bash
TWITCH_CLIENT_ID=<tu_client_id_de_twitch>
TWITCH_CLIENT_SECRET=<tu_client_secret_de_twitch>
PORT=3000

```
Nota: Para obtener Client ID y Client Secret, crea una nueva aplicación en el panel de desarrollador de Twitch. El tipo de cliente debe ser Confidential. No uses el client secret en el frontend.

3. Ejecutar el backend
``` bash
node services/index.js

```
El backend correrá en http://localhost:3000.

La ruta principal para obtener juegos es: 
``` bash
GET http://localhost:3000/api/juegos?nombre=<nombre_del_juego>\
```

## Configuración del Frontend
1. Instalar dependencias

``` bash
cd frontend
npm install
```

2. Ejecutar el frontend
``` bash
npm run dev
```

Esto iniciará la aplicación React en http://localhost:5173 (o el puerto que configure React).

## 📌 Uso del Proyecto

### Catálogo de Juegos
- Ingresa un nombre de juego en la barra de búsqueda.
- Se mostrarán hasta 5 resultados obtenidos de la API de IGDB.
- Cada juego incluye: **nombre, resumen, género y portada**.

### Estadísticas de Jugadores
- Se muestran estadísticas ficticias de jugadores.
- La tabla incluye:
  - Nombre del jugador
  - Partidas jugadas
  - Victorias
  - Porcentaje de victorias (calculado automáticamente)

---

## 🗂 Estructura de Archivos Importante

- **Catalogo.jsx** → Componente React que muestra los juegos buscados.
- **Estadisticas.jsx** → Componente React que muestra la tabla de estadísticas.
- **dataService.js** → Servicio para obtener datos del backend.
- **igdbService.js** → Servicio del backend que consulta la API de IGDB usando Twitch.
- **index.js (backend)** → Archivo principal que inicia el servidor Express.
- **gameRouter.js** → Router que maneja la ruta `/api/juegos`.

---

## 🧩 Dependencias Clave

### Backend
- `express`
- `cors`
- `dotenv`
- `node-fetch`

### Frontend
- `react`
- `react-dom`
- `bootstrap` (opcional para estilos)

---

## ⚠️ Advertencias y Consejos

- **API keys**: No compartas tu Client Secret. Úsalo solo en el backend.
- **CORS**: El backend está configurado con `cors()` para permitir peticiones desde el frontend.
- **Tokens de Twitch**: Cada token de acceso tiene una duración limitada (aprox. 60 días). Si se caduca, se deberá obtener uno nuevo.

### Errores comunes
- Si el frontend siempre muestra el **"Juego de prueba"**, revisa que el backend esté corriendo y que tu `.env` tenga los valores correctos de Twitch.
- Evita nombres de carpetas con **espacios o caracteres especiales** al ejecutar Node.js.

---

## 📚 Referencias

- [Documentación IGDB](https://api-docs.igdb.com/)
- [Twitch Developer Console](https://dev.twitch.tv/console)
- [React Docs](https://react.dev/)
- [Bootstrap Docs](https://getbootstrap.com/docs/)























