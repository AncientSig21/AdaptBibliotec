import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

interface Libro {
  id_libro: number;
  titulo: string;
  sinopsis: string;
  type?: string;
  url_portada?: string;
  especialidad?: string;
  fecha_publicacion?: string;
  url_pdf?: string;
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

// Función para subir PDF a Supabase Storage y obtener la URL pública
async function uploadPdfToSupabase(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const { data, error } = await supabase.storage.from('libros').upload(fileName, file);
  if (error) {
    alert('Error al subir el PDF: ' + error.message);
    return null;
  }
  // Obtener la URL pública
  const { publicUrl } = supabase.storage.from('libros').getPublicUrl(fileName).data;
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
  const [editLibro, setEditLibro] = useState<Libro | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [selectedLibroId, setSelectedLibroId] = useState<number | null>(null);

  // Obtener lista de libros
  const fetchLibros = async () => {
    setLoading(true);
    setError(null);
    let selectFields = 'id_libro, titulo, sinopsis, fecha_publicacion, url_portada, tipo, especialidad';
    let { data, error } = await supabase
      .from('Libros')
      .select(selectFields);
    // Si da error por 'tipo', intenta con 'type'
    if (error && error.message && error.message.includes('tipo')) {
      selectFields = 'id_libro, titulo, sinopsis, fecha_publicacion, url_portada, type, especialidad';
      ({ data, error } = await supabase
        .from('Libros')
        .select(selectFields));
    }
    // Si da error por 'especialidad', omite ese campo
    if (error && error.message && error.message.includes('especialidad')) {
      selectFields = selectFields.replace(', especialidad', '').replace(',especialidad', '');
      ({ data, error } = await supabase
        .from('Libros')
        .select(selectFields));
    }
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

  // Depuración: mostrar libros en consola
  console.log('[ADMIN] Libros cargados:', libros);

  // Agregar libro
  const handleAddLibro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddError(null);
    setAddLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const titulo = formData.get('titulo')?.toString().trim() || '';
    const autor = formData.get('autor')?.toString().trim() || '';
    const fecha_publicacion = formData.get('fecha_publicacion')?.toString() || '';
    const sinopsis = formData.get('sinopsis')?.toString().trim() || '';
    const url_portada = formData.get('url_portada')?.toString().trim() || '';
    const tipo = formData.get('tipo')?.toString().trim() || '';
    const especialidad = formData.get('especialidad')?.toString().trim() || '';
    const pdfFile = formData.get('url_pdf') as File | null;
    let url_pdf = '';
    if (pdfFile && pdfFile.size > 0) {
      url_pdf = (await uploadPdfToSupabase(pdfFile)) || '';
    }
    if (!titulo || !autor || !fecha_publicacion || !sinopsis || !tipo || !especialidad) {
      setAddError('Completa todos los campos obligatorios');
      setAddLoading(false);
      return;
    }
    const { error } = await supabase
      .from('Libros')
      .insert([{ titulo, sinopsis, fecha_publicacion, url_portada: url_portada || null, tipo, especialidad, url_pdf: url_pdf || null }]);
    if (error) {
      setAddError('Error al agregar libro');
    } else {
      setShowForm(false);
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

  // Editar libro
  const handleEditLibro = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditError(null);
    setEditLoading(true);
    if (!editLibro) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const titulo = formData.get('titulo')?.toString().trim() || '';
    const sinopsis = formData.get('sinopsis')?.toString().trim() || '';
    const url_portada = formData.get('url_portada')?.toString().trim() || '';
    const tipo = formData.get('type')?.toString().trim() || '';
    const especialidad = formData.get('especialidad')?.toString().trim() || '';
    const fecha_publicacion = formData.get('fecha_publicacion')?.toString() || '';
    if (!titulo || !sinopsis || !tipo || !especialidad || !fecha_publicacion) {
      setEditError('Completa todos los campos obligatorios');
      setEditLoading(false);
      return;
    }
    // Intentar primero con 'tipo'
    let { error } = await supabase
      .from('Libros')
      .update({ titulo, sinopsis, url_portada: url_portada || null, tipo, especialidad, fecha_publicacion })
      .eq('id_libro', editLibro.id_libro);
    // Si da error por 'tipo', intenta con 'type'
    if (error && error.message && error.message.includes('tipo')) {
      ({ error } = await supabase
        .from('Libros')
        .update({ titulo, sinopsis, url_portada: url_portada || null, type: tipo, especialidad, fecha_publicacion })
        .eq('id_libro', editLibro.id_libro));
    }
    // Si da error por 'especialidad', omite ese campo
    if (error && error.message && error.message.includes('especialidad')) {
      ({ error } = await supabase
        .from('Libros')
        .update({ titulo, sinopsis, url_portada: url_portada || null, tipo, fecha_publicacion })
        .eq('id_libro', editLibro.id_libro));
    }
    if (error) {
      console.log('[ADMIN][EDIT] Error al actualizar libro:', error);
    }
    if (error) {
      setEditError('Error al actualizar libro');
    } else {
      setEditLibro(null);
      fetchLibros();
    }
    setEditLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center">Gestión de Libros</h1>
      <div className="bg-white rounded shadow p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Libros</h2>
        <p className="text-gray-600 mb-4">Aquí podrás ver, agregar, editar y eliminar libros.</p>
        <div className="flex gap-2 mb-4 items-center">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? 'Cancelar' : 'Agregar Libro'}
          </button>
        </div>
        {showForm && (
          <form onSubmit={handleAddLibro} className="mb-6 flex flex-col gap-3">
            <input type="text" name="titulo" required placeholder="Título" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white" />
            <input type="text" name="autor" required placeholder="Autor" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white" />
            <input type="date" name="fecha_publicacion" required placeholder="Fecha de publicación" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white" />
            <textarea name="sinopsis" required placeholder="Sinopsis" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white resize-none min-h-[80px]" />
            <div className="flex items-center gap-2">
              <input type="url" name="url_portada" placeholder="URL de la portada (opcional)" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white flex-1" id="input-url-portada" />
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
            <div className="flex items-center gap-2">
              <label className="block text-sm font-medium text-gray-700">Archivo PDF (opcional):</label>
              <input type="file" name="url_pdf" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/epub+zip" className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white flex-1" />
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
              className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center min-h-[180px] max-h-[220px] w-[200px] max-w-[220px] justify-center cursor-pointer transition-all hover:shadow-lg hover:bg-cyan-50"
              style={{ minHeight: 180, maxHeight: 220, width: 200, maxWidth: 220 }}
              onClick={() => setSelectedLibroId(libro.id_libro)}
            >
              {libro.url_portada && (
                <img
                  src={libro.url_portada}
                  alt={libro.titulo}
                  className="w-24 h-32 object-cover rounded mb-2 self-center"
                  style={{ maxWidth: 96, maxHeight: 128 }}
                />
              )}
              <strong className="text-base mb-1 truncate w-full text-center block overflow-hidden whitespace-nowrap" style={{ maxWidth: 180 }} title={libro.titulo}>
                {libro.titulo}
              </strong>
              {selectedLibroId === libro.id_libro && (
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                    onClick={e => {
                      e.stopPropagation();
                      setEditLibro(libro);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                    onClick={e => {
                      e.stopPropagation();
                      setConfirmDeleteId(libro.id_libro);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              )}
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
        {/* Modal de edición */}
        {editLibro && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
              <h3 className="text-xl font-bold mb-4">Editar libro</h3>
              <form onSubmit={handleEditLibro} className="flex flex-col gap-3 text-left">
                <input type="text" name="titulo" defaultValue={editLibro.titulo} required placeholder="Título" className="border border-gray-300 rounded-lg px-4 py-2" />
                <textarea name="sinopsis" defaultValue={editLibro.sinopsis} required placeholder="Sinopsis" className="border border-gray-300 rounded-lg px-4 py-2 resize-none min-h-[80px]" />
                <input type="url" name="url_portada" defaultValue={editLibro.url_portada || ''} placeholder="URL de la portada (opcional)" className="border border-gray-300 rounded-lg px-4 py-2" />
                <input type="text" name="type" defaultValue={editLibro.type || ''} required placeholder="Tipo (Físico, Virtual, Tesis, etc.)" className="border border-gray-300 rounded-lg px-4 py-2" />
                <input type="text" name="especialidad" defaultValue={editLibro.especialidad || ''} required placeholder="Especialidad" className="border border-gray-300 rounded-lg px-4 py-2" />
                <input type="date" name="fecha_publicacion" defaultValue={editLibro.fecha_publicacion ? editLibro.fecha_publicacion.substring(0, 10) : ''} required placeholder="Fecha de publicación" className="border border-gray-300 rounded-lg px-4 py-2" />
                {editError && <p className="text-red-500 text-sm">{editError}</p>}
                <div className="flex gap-2 justify-end mt-2">
                  <button type="button" onClick={() => setEditLibro(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                  <button type="submit" className="bg-cyan-600 text-white rounded-lg px-4 py-2 hover:bg-cyan-700 transition" disabled={editLoading}>{editLoading ? 'Guardando...' : 'Guardar cambios'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooksPage; 