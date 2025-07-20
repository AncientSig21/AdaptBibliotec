-- Agregar políticas RLS a tablas existentes
-- Ejecuta este SQL en el SQL Editor de Supabase

-- 1. Habilitar RLS en todas las tablas (si no está habilitado)
ALTER TABLE autor ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Libros" ENABLE ROW LEVEL SECURITY;
ALTER TABLE libros_autores ENABLE ROW LEVEL SECURITY;
ALTER TABLE libros_virtuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE libros_fisicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyecto_investigacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE tesis ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes (si las hay) para evitar conflictos
DROP POLICY IF EXISTS "Libros visibles para todos" ON "Libros";
DROP POLICY IF EXISTS "Autores visibles para todos" ON autor;
DROP POLICY IF EXISTS "Libros virtuales visibles para todos" ON libros_virtuales;
DROP POLICY IF EXISTS "Libros físicos visibles para todos" ON libros_fisicos;
DROP POLICY IF EXISTS "Admin puede crear libros" ON "Libros";
DROP POLICY IF EXISTS "Admin puede crear autores" ON autor;
DROP POLICY IF EXISTS "Admin puede gestionar libros virtuales" ON libros_virtuales;
DROP POLICY IF EXISTS "Admin puede gestionar libros físicos" ON libros_fisicos;
DROP POLICY IF EXISTS "Usuarios pueden ver sus reservas" ON reservas;
DROP POLICY IF EXISTS "Usuarios pueden crear reservas" ON reservas;
DROP POLICY IF EXISTS "Admin puede gestionar todas las reservas" ON reservas;

-- 3. Crear políticas para lectura pública de libros
CREATE POLICY "Libros visibles para todos" ON "Libros"
    FOR SELECT USING (true);

CREATE POLICY "Autores visibles para todos" ON autor
    FOR SELECT USING (true);

CREATE POLICY "Libros virtuales visibles para todos" ON libros_virtuales
    FOR SELECT USING (true);

CREATE POLICY "Libros físicos visibles para todos" ON libros_fisicos
    FOR SELECT USING (true);

-- 4. Políticas para administradores (solo usuarios autenticados pueden crear/editar)
CREATE POLICY "Admin puede crear libros" ON "Libros"
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede crear autores" ON autor
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar libros virtuales" ON libros_virtuales
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar libros físicos" ON libros_fisicos
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. Políticas para reservas (usuarios pueden ver sus propias reservas)
CREATE POLICY "Usuarios pueden ver sus reservas" ON reservas
    FOR SELECT USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Usuarios pueden crear reservas" ON reservas
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar todas las reservas" ON reservas
    FOR ALL USING (auth.role() = 'authenticated');

-- 6. Políticas para otras tablas
CREATE POLICY "Tutor visible para todos" ON tutor
    FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar tutor" ON tutor
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Proyecto investigación visible para todos" ON proyecto_investigacion
    FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar proyecto investigación" ON proyecto_investigacion
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Tesis visible para todos" ON tesis
    FOR SELECT USING (true);

CREATE POLICY "Admin puede gestionar tesis" ON tesis
    FOR ALL USING (auth.role() = 'authenticated');

-- 7. Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname; 