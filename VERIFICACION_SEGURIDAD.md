# ✅ Verificación de Seguridad - Checklist

Ejecuta estos comandos para verificar que tu repositorio está seguro antes de hacer commit:

## 1. Verificar que no hay archivos .env siendo trackeados

```bash
# En la raíz del proyecto
git ls-files | grep .env

# No debe mostrar ningún resultado
# Si muestra archivos .env, ejecuta:
# git rm --cached backend/.env
# git rm --cached frontend/.env
```

## 2. Verificar que los .gitignore están configurados

```bash
# Verificar .gitignore raíz
cat .gitignore | grep -E "^\.env$|\.env$"

# Verificar backend/.gitignore
cat backend/.gitignore | grep -E "^\.env$|\.env$"

# Verificar frontend/.gitignore
cat frontend/.gitignore | grep -E "^\.env$|\.env$"
```

Todos deben mostrar `.env` en la lista.

## 3. Verificar que no hay credenciales hardcodeadas

```bash
# Buscar posibles credenciales hardcodeadas en el código
grep -r "TWITCH_CLIENT_ID=" backend/
grep -r "TWITCH_CLIENT_SECRET=" backend/
grep -r "STEAM_API_KEY=" backend/
grep -r "FIREBASE_API_KEY=" frontend/

# No debe mostrar resultados (excepto en .env.example que es seguro)
```

## 4. Verificar archivos que se van a subir

```bash
# Ver el estado de Git
git status

# No debe aparecer ningún archivo .env en la lista
```

## 5. Verificar que los .env.example existen

```bash
# Verificar que existen los archivos de ejemplo (sí deben estar en el repo)
ls backend/.env.example
ls frontend/.env.example

# Ambos deben existir
```

## ✅ Resultado Esperado

- ✅ No hay archivos `.env` en `git status`
- ✅ Los archivos `.env` están en todos los `.gitignore`
- ✅ Existen archivos `.env.example` en backend y frontend
- ✅ No hay credenciales hardcodeadas en el código
- ✅ No hay `console.log` que expongan tokens o secrets

## 🚨 Si encuentras problemas

Si encuentras archivos `.env` siendo trackeados:

1. **NO hagas commit todavía**
2. Ejecuta:
   ```bash
   git rm --cached backend/.env 2>/dev/null || true
   git rm --cached frontend/.env 2>/dev/null || true
   ```
3. Verifica que los `.gitignore` estén correctos
4. Vuelve a verificar con `git status`
5. Solo entonces haz commit

