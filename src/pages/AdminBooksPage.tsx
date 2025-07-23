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
  // Obtener la URL pública del mismo bucket donde se subió
  const { publicUrl } = supabase.storage.from('fotos.portada').getPublicUrl(fileName).data;
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
  // Estado para los checkboxes de tipo
  const [tipoFisico, setTipoFisico] = useState(false);
  const [tipoVirtual, setTipoVirtual] = useState(false);
  const [tipoTesis, setTipoTesis] = useState(false);
  const [tipoProyecto, setTipoProyecto] = useState(false);
  // Estados adicionales para campos condicionales
  const [cantidadFisico, setCantidadFisico] = useState('');
  const [periodoTesis, setPeriodoTesis] = useState('');
  const [tutorTesis, setTutorTesis] = useState('');
  // Estado para la lista de tutores
  const [tutores, setTutores] = useState<{ id: number; nombre: string }[]>([]);

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

  useEffect(() => {
    // Cargar tutores al montar el componente
    const fetchTutores = async () => {
      const { data, error } = await supabase.from('tutor').select('id, nombre');
      if (!error && data) setTutores(data);
    };
    fetchTutores();
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
    let tipo = '';
    if (tipoTesis) {
      tipo = 'Tesis';
    } else if (tipoProyecto) {
      tipo = 'Proyecto de Investigacion';
    } else if (tipoFisico && tipoVirtual) {
      tipo = 'Fisico y Virtual';
    } else if (tipoFisico) {
      tipo = 'Fisico';
    } else if (tipoVirtual) {
      tipo = 'Virtual';
    }
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
    // Guardar libro en 'Libros'
    const { error: errorLibro, data: dataLibro } = await supabase
      .from('Libros')
      .insert([{ titulo, sinopsis, fecha_publicacion, url_portada: url_portada || null, tipo, especialidad }])
      .select();
    if (errorLibro) {
      setAddError('Error al agregar libro: ' + (errorLibro.message || JSON.stringify(errorLibro)));
      console.error('[ADMIN][ADD] Error al agregar libro:', errorLibro);
      setAddLoading(false);
      return;
    }
    // Si hay PDF, guardar en 'libros_virtuales'
    if (url_pdf && dataLibro && dataLibro.length > 0) {
      const libro_id = dataLibro[0].id_libro;
      const { error: errorVirtual } = await supabase
        .from('libros_virtuales')
        .insert([{ libro_id, direccion_del_libro: url_pdf }]);
      if (errorVirtual) {
        setAddError('Libro guardado, pero error al guardar PDF en libros_virtuales: ' + (errorVirtual.message || JSON.stringify(errorVirtual)));
        console.error('[ADMIN][ADD] Error al guardar PDF en libros_virtuales:', errorVirtual);
        setAddLoading(false);
        return;
      }
    }
    // Después de insertar en 'Libros':
    if (tipoFisico && cantidadFisico && dataLibro && dataLibro.length > 0) {
      const libro_id = dataLibro[0].id_libro;
      await supabase.from('libros_fisicos').insert([{ libro_id, cantidad: parseInt(cantidadFisico, 10) }]);
    }
    if (tipoTesis && periodoTesis && tutorTesis && especialidad && dataLibro && dataLibro.length > 0) {
      const libro_id = dataLibro[0].id_libro;
      await supabase.from('tesis').insert([{ libro_id, periodo_academico: periodoTesis, tutor_id: Number(tutorTesis), escuela: especialidad }]);
    }
    if (tipoProyecto && periodoTesis && tutorTesis && especialidad && dataLibro && dataLibro.length > 0) {
      const libro_id = dataLibro[0].id_libro;
      await supabase.from('proyecto_investigacion').insert([{ libro_id, periodo_academico: periodoTesis, tutor_id: Number(tutorTesis), escuela: especialidad }]);
    }
    setShowForm(false);
    fetchLibros();
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
            {/* Checkboxes para tipo de libro */}
            <div className="flex flex-col gap-2">
              <label className="font-medium">Tipo de libro:</label>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={tipoFisico} onChange={e => setTipoFisico(e.target.checked)} /> Físico
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={tipoVirtual} onChange={e => setTipoVirtual(e.target.checked)} /> Virtual
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={tipoTesis} onChange={e => {
                    setTipoTesis(e.target.checked);
                    if (e.target.checked) setTipoProyecto(false);
                  }} /> Tesis
                </label>
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={tipoProyecto} onChange={e => {
                    setTipoProyecto(e.target.checked);
                    if (e.target.checked) setTipoTesis(false);
                  }} /> Proyecto de Investigación
                </label>
              </div>
            </div>
            {/* Campo condicional para cantidad si es Físico */}
            {tipoFisico && (
              <div className="flex flex-col gap-1">
                <label className="font-medium">Cantidad de libros físicos:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={cantidadFisico}
                  onChange={e => setCantidadFisico(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white"
                  placeholder="Cantidad de ejemplares físicos"
                />
              </div>
            )}
            {/* Campos condicionales para Tesis o Proyecto de Investigación */}
            {(tipoTesis || tipoProyecto) && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-medium">Período académico:</label>
                  <input
                    type="text"
                    required
                    value={periodoTesis}
                    onChange={e => setPeriodoTesis(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white"
                    placeholder="Ej: 2023-2024"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium">Tutor:</label>
                  <select
                    required
                    value={tutorTesis}
                    onChange={e => setTutorTesis(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white"
                  >
                    <option value="">Selecciona un tutor</option>
                    {tutores.map(t => (
                      <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {/* Reemplazar input de especialidad por un select */}
            <select name="especialidad" required className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white">
              <option value="">Selecciona una especialidad</option>
              <option value="Arquitectura">Arquitectura</option>
              <option value="Ingenieria Civil">Ingenieria Civil</option>
              <option value="Ingenieria en Mantenimiento Mecanico">Ingenieria en Mantenimiento Mecanico</option>
              <option value="Ingenieria Electronica">Ingenieria Electronica</option>
              <option value="Ingenieria Industrial">Ingenieria Industrial</option>
              <option value="Ingenieria Electrica">Ingenieria Electrica</option>
              <option value="Ingenieria en Sistemas">Ingenieria en Sistemas</option>
            </select>
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