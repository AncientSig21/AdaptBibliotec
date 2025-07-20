# Instrucciones de Configuración

## 🔧 Configuración de Variables de Entorno

Para que la aplicación funcione correctamente, necesitas configurar las variables de entorno de Supabase.

### 1. Crear archivo .env

En la raíz del proyecto, crea un archivo llamado `.env` con el siguiente contenido:

```env
VITE_SUPABASE_API_KEY=tu_clave_anonima_de_supabase_aqui
VITE_PROJECT_URL_SUPABASE=tu_url_del_proyecto_supabase_aqui
```

### 2. Obtener las credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto
4. Ve a **Settings > API**
5. Copia los siguientes valores:
   - **Project URL** → `VITE_PROJECT_URL_SUPABASE`
   - **anon public** → `VITE_SUPABASE_API_KEY`

### 3. Ejemplo de configuración

```env
VITE_SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdG5wdmJqY2NqY2NqY2NqY2MiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjQ0NjQwMCwiZXhwIjoxOTUyMDIyNDAwfQ.Ejemplo
VITE_PROJECT_URL_SUPABASE=https://xtmnpvbjccjccjccjccjcc.supabase.co
```

### 4. Verificar la configuración

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve a `http://localhost:5173/test` para verificar la conexión

3. Si todo está configurado correctamente, deberías ver "Conexión exitosa!"

### 5. Problemas comunes

- **Error 401**: Verifica que la clave API sea correcta
- **Error 404**: Verifica que la URL del proyecto sea correcta
- **Error de red**: Verifica tu conexión a internet

### 6. Después de la configuración

Una vez que las variables estén configuradas:

1. Los libros se mostrarán en la página principal
2. Podrás navegar a `/libros` para ver todos los libros
3. El dashboard funcionará correctamente

## 🚀 Próximos pasos

1. Configura las variables de entorno
2. Ejecuta el esquema SQL en Supabase (ver `SUPABASE_SETUP.md`)
3. Prueba la aplicación en `http://localhost:5173` 