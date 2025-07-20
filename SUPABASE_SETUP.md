# Configuración de Supabase para Biblioteca Virtual

## 📋 Pasos para actualizar Supabase

### 1. Acceder al Dashboard de Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto

### 2. Ejecutar el Esquema SQL
1. Ve a la sección **SQL Editor** en el dashboard
2. Crea un nuevo query
3. Copia y pega el contenido del archivo `database_schema.sql`
4. Ejecuta el query

### 3. Verificar las Tablas Creadas
Después de ejecutar el esquema, deberías ver las siguientes tablas:
- `autor`
- `libros`
- `libros_autores`
- `libros_virtuales`
- `libros_fisicos`
- `reservas`
- `tutor`
- `proyecto_investigacion`
- `tesis`

### 4. Verificar las Políticas RLS
En la sección **Authentication > Policies**, verifica que se hayan creado las políticas de seguridad.

### 5. Actualizar el Cliente de Supabase
Una vez que las tablas estén creadas, necesitarás:

1. **Regenerar los tipos de TypeScript:**
   ```bash
   npx supabase gen types typescript --project-id TU_PROJECT_ID > src/supabase/supabase.ts
   ```

2. **Actualizar los hooks** para usar las nuevas tablas:
   - `src/hooks/books/useBooks.ts`
   - `src/hooks/books/useBook.ts`
   - `src/hooks/books/useCreateBook.ts`
   - `src/hooks/books/useUpdateBook.ts`
   - `src/hooks/books/useDeleteBook.ts`
   - `src/hooks/authors/useAuthors.ts`
   - `src/hooks/authors/useCreateAuthor.ts`

### 6. Datos de Ejemplo
El esquema incluye datos de ejemplo para probar la funcionalidad:
- 5 autores famosos
- 5 libros clásicos
- Relaciones entre libros y autores
- Algunos libros virtuales y físicos

## 🔧 Comandos Útiles

### Regenerar tipos de Supabase
```bash
npx supabase gen types typescript --project-id TU_PROJECT_ID > src/supabase/supabase.ts
```

### Verificar conexión
```bash
npx supabase status
```

## 📝 Notas Importantes

1. **Backup:** Antes de ejecutar el esquema, haz un backup de tu base de datos actual
2. **Políticas RLS:** Las políticas están configuradas para permitir lectura pública pero escritura solo para usuarios autenticados
3. **Índices:** Se han creado índices para mejorar el rendimiento de las consultas
4. **Relaciones:** Las relaciones están configuradas con CASCADE para mantener la integridad referencial

## 🚀 Después de la Configuración

Una vez que hayas ejecutado el esquema y regenerado los tipos:

1. Los hooks funcionarán con las tablas reales de biblioteca
2. El formulario de libros funcionará correctamente
3. La tabla de libros mostrará datos reales
4. El sistema de reservas estará disponible

## 🔍 Verificación

Para verificar que todo funciona:

1. Ve a `/dashboard/libros` - deberías ver la tabla de libros
2. Haz clic en "Agregar Libro" - deberías poder crear un nuevo libro
3. Verifica que los datos se guarden correctamente en Supabase 