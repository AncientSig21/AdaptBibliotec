-- Esquema de Base de Datos para Biblioteca Virtual
-- Basado en el ERD proporcionado

-- Tabla de autores
CREATE TABLE autor (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla principal de libros
CREATE TABLE libros (
    id_libro BIGSERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    fecha_publicacion DATE NOT NULL,
    sinopsis TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relación muchos a muchos entre libros y autores
CREATE TABLE libros_autores (
    libro_id BIGINT REFERENCES libros(id_libro) ON DELETE CASCADE,
    autor_id BIGINT REFERENCES autor(id) ON DELETE CASCADE,
    PRIMARY KEY (libro_id, autor_id)
);

-- Tabla para libros virtuales
CREATE TABLE libros_virtuales (
    id BIGSERIAL PRIMARY KEY,
    libro_id BIGINT REFERENCES libros(id_libro) ON DELETE CASCADE,
    direccion_del_libro TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para libros físicos
CREATE TABLE libros_fisicos (
    id BIGSERIAL PRIMARY KEY,
    libro_id BIGINT REFERENCES libros(id_libro) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de usuarios (extendiendo la tabla existente)
-- Nota: Esta tabla ya existe, solo agregamos campos si es necesario
-- ALTER TABLE users ADD COLUMN rol TEXT DEFAULT 'usuario';
-- ALTER TABLE users ADD COLUMN estado TEXT DEFAULT 'activo';

-- Tabla de reservas
CREATE TABLE reservas (
    id_reservas BIGSERIAL PRIMARY KEY,
    libro_id BIGINT REFERENCES libros(id_libro) ON DELETE CASCADE,
    usuario_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    tipo_de_libro TEXT NOT NULL CHECK (tipo_de_libro IN ('virtual', 'fisico')),
    fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    estado TEXT DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'activa', 'completada', 'cancelada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tutores (para proyectos de investigación y tesis)
CREATE TABLE tutor (
    id BIGSERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de proyectos de investigación
CREATE TABLE proyecto_investigacion (
    id BIGSERIAL PRIMARY KEY,
    libro_id BIGINT REFERENCES libros(id_libro) ON DELETE CASCADE,
    escuela TEXT,
    periodo_academico TEXT,
    tutor_id BIGINT REFERENCES tutor(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tesis
CREATE TABLE tesis (
    id BIGSERIAL PRIMARY KEY,
    libro_id BIGINT REFERENCES libros(id_libro) ON DELETE CASCADE,
    escuela TEXT,
    periodo_academico TEXT,
    tutor_id BIGINT REFERENCES tutor(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_libros_titulo ON libros(titulo);
CREATE INDEX idx_libros_fecha_publicacion ON libros(fecha_publicacion);
CREATE INDEX idx_libros_autores_libro_id ON libros_autores(libro_id);
CREATE INDEX idx_libros_autores_autor_id ON libros_autores(autor_id);
CREATE INDEX idx_reservas_libro_id ON reservas(libro_id);
CREATE INDEX idx_reservas_usuario_id ON reservas(usuario_id);
CREATE INDEX idx_reservas_estado ON reservas(estado);
CREATE INDEX idx_reservas_fecha_inicio ON reservas(fecha_inicio);

-- Políticas RLS (Row Level Security) para Supabase
-- Habilitar RLS en todas las tablas
ALTER TABLE autor ENABLE ROW LEVEL SECURITY;
ALTER TABLE libros ENABLE ROW LEVEL SECURITY;
ALTER TABLE libros_autores ENABLE ROW LEVEL SECURITY;
ALTER TABLE libros_virtuales ENABLE ROW LEVEL SECURITY;
ALTER TABLE libros_fisicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyecto_investigacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE tesis ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública de libros
CREATE POLICY "Libros visibles para todos" ON libros
    FOR SELECT USING (true);

CREATE POLICY "Autores visibles para todos" ON autor
    FOR SELECT USING (true);

CREATE POLICY "Libros virtuales visibles para todos" ON libros_virtuales
    FOR SELECT USING (true);

CREATE POLICY "Libros físicos visibles para todos" ON libros_fisicos
    FOR SELECT USING (true);

-- Políticas para administradores (solo usuarios autenticados pueden crear/editar)
CREATE POLICY "Admin puede crear libros" ON libros
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede crear autores" ON autor
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar libros virtuales" ON libros_virtuales
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar libros físicos" ON libros_fisicos
    FOR ALL USING (auth.role() = 'authenticated');

-- Políticas para reservas (usuarios pueden ver sus propias reservas)
CREATE POLICY "Usuarios pueden ver sus reservas" ON reservas
    FOR SELECT USING (auth.uid()::text = usuario_id::text);

CREATE POLICY "Usuarios pueden crear reservas" ON reservas
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin puede gestionar todas las reservas" ON reservas
    FOR ALL USING (auth.role() = 'authenticated');

-- Datos de ejemplo
INSERT INTO autor (nombre) VALUES 
('J.R.R. Tolkien'),
('George R.R. Martin'),
('J.K. Rowling'),
('Stephen King'),
('Agatha Christie');

INSERT INTO libros (titulo, fecha_publicacion, sinopsis) VALUES 
('El Señor de los Anillos', '1954-07-29', 'Una épica historia de fantasía sobre la lucha contra el mal.'),
('Juego de Tronos', '1996-08-01', 'Una saga de fantasía política en un mundo medieval.'),
('Harry Potter y la Piedra Filosofal', '1997-06-26', 'La historia de un joven mago descubriendo su destino.'),
('El Resplandor', '1977-01-28', 'Una novela de terror psicológico.'),
('Asesinato en el Orient Express', '1934-01-01', 'Una novela de misterio clásica.');

-- Relacionar libros con autores
INSERT INTO libros_autores (libro_id, autor_id) VALUES 
(1, 1), -- El Señor de los Anillos - J.R.R. Tolkien
(2, 2), -- Juego de Tronos - George R.R. Martin
(3, 3), -- Harry Potter - J.K. Rowling
(4, 4), -- El Resplandor - Stephen King
(5, 5); -- Asesinato en el Orient Express - Agatha Christie

-- Agregar algunos libros virtuales
INSERT INTO libros_virtuales (libro_id, direccion_del_libro) VALUES 
(1, 'https://ejemplo.com/el-senor-de-los-anillos.pdf'),
(3, 'https://ejemplo.com/harry-potter.pdf');

-- Agregar algunos libros físicos
INSERT INTO libros_fisicos (libro_id, cantidad) VALUES 
(2, 5),
(4, 3),
(5, 2); 