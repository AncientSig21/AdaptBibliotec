import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

interface Libro {
  id_libro: number;
  titulo: string;
  sinopsis: string;
  type?: string;
  url_portada?: string;
}

// Función para subir imagen a Supabase Storage y obtener la URL pública
async function uploadImageToSupabase(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage.from('fotos.portada').upload(fileName, file);
  if (error) {
    alert('Error al subir la imagen: ' + error.message);
    return null;
  }
  // Obtener la URL pública
  const { publicUrl } = supabase.storage.from('portadas').getPublicUrl(fileName).data;
  return publicUrl || null;
}

const AdminBooksPage = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTitulo, setNewTitulo] = useState('');
  const [newSinopsis, setNewSinopsis] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Obtener lista de libros
  const fetchLibros = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('Libros')
      .select('id_libro, titulo, sinopsis, type');
    if (error) {
      setError('Error al obtener los libros');
      setLibros([]);
    } else {
      setLibros(data as unknown as Libro[] || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLibros();
  }, []);

  // Agregar libro
  const handleAddLibro = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddLoading(true);
    if (!newTitulo.trim() || !newSinopsis.trim()) {
      setAddError('Completa todos los campos');
      setAddLoading(false);
      return;
    }
    const { error } = await supabase
      .from('Libros')
      .insert([{ titulo: newTitulo, sinopsis: newSinopsis, fecha_publicacion: new Date().toISOString() }]);
    if (error) {
      setAddError('Error al agregar libro');
    } else {
      setShowForm(false);
      setNewTitulo('');
      setNewSinopsis('');
      fetchLibros();
    }
    setAddLoading(false);
  };

  // Eliminar libro (solo si se confirma)
  const handleDeleteLibro = async (id_libro: number) => {
    setDeleteLoading(id_libro);
    const { error } = await supabase
      .from('Libros')
      .delete()
      .eq('id_libro', id_libro);
    if (!error) {
      fetchLibros();
    }
    setDeleteLoading(null);
    setConfirmDeleteId(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestión de Libros</h1>
      <div className="bg-white rounded shadow p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Libros</h2>
        <p className="text-gray-600 mb-4">Aquí podrás ver, agregar, editar y eliminar libros.</p>
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancelar' : 'Agregar Libro'}
        </button>
        {showForm && (
          <form onSubmit={handleAddLibro} className="mb-6 flex flex-col gap-3">
            <input type="text" name="titulo" required placeholder="Título" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white" />
            <input type="text" name="autor" required placeholder="Autor" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white" />
            <input type="date" name="fecha_publicacion" required placeholder="Fecha de publicación" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white" />
            <textarea name="sinopsis" required placeholder="Sinopsis" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white resize-none min-h-[80px]" />
            <div className="flex items-center gap-2">
              <input type="url" name="url_portada" required placeholder="URL de la portada" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white flex-1" id="input-url-portada" />
              <label htmlFor="file-portada" className="cursor-pointer bg-cyan-600 text-white rounded-lg px-3 py-2 flex items-center justify-center hover:bg-cyan-700 transition" title="Subir imagen">
                <span className="text-xl font-bold">+</span>
                <input type="file" id="file-portada" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // Subir la imagen a Supabase Storage y obtener la URL pública
                  const url = await uploadImageToSupabase(file);
                  const input = document.getElementById('input-url-portada') as HTMLInputElement | null;
                  if (input && url) input.value = url;
                }} />
              </label>
            </div>
            <input type="text" name="tipo" required placeholder="Tipo (Físico, Virtual, Tesis, etc.)" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white" />
            <input type="text" name="especialidad" required placeholder="Especialidad" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white" />
            {addError && <p className="text-red-500 text-sm">{addError}</p>}
            <button type="submit" className="bg-cyan-600 text-white rounded-lg px-4 py-2 mt-2 hover:bg-cyan-700 transition">Guardar Libro</button>
          </form>
        )}
        {/* Cuadros de libros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {libros.map((libro) => (
            <div
              key={libro.id_libro}
              className="bg-gray-100 rounded-lg shadow p-3 flex flex-col items-start min-h-[120px] max-h-[220px] w-full"
              style={{ minHeight: 120, maxHeight: 220 }}
            >
              {libro.url_portada && (
                <img
                  src={libro.url_portada}
                  alt={libro.titulo}
                  className="w-24 h-32 object-cover rounded mb-2 self-center"
                  style={{ maxWidth: 96, maxHeight: 128 }}
                />
              )}
              <strong className="text-base mb-1 truncate w-full" title={libro.titulo}>
                {libro.titulo}
              </strong>
              <div
                className="text-xs text-gray-600 mb-2 w-full overflow-hidden"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  whiteSpace: 'normal',
                }}
                title={libro.sinopsis}
              >
                {libro.sinopsis}
              </div>
              <button
                onClick={() => setConfirmDeleteId(libro.id_libro)}
                className="mt-auto px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                disabled={deleteLoading === libro.id_libro}
              >
                {deleteLoading === libro.id_libro ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          ))}
        </div>
        {/* Modal de confirmación de eliminación */}
        {confirmDeleteId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full text-center">
              <p className="mb-4">¿Estás seguro de que deseas eliminar este libro?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={deleteLoading !== null}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleDeleteLibro(confirmDeleteId)}
                  disabled={deleteLoading !== null}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooksPage; 