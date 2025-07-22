import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

interface Libro {
  id_libro: number;
  titulo: string;
  sinopsis: string;
  type?: string;
}

const AdminDashboard = () => {
  const [totalLibros, setTotalLibros] = useState<number>(0);
  const [totalTesis, setTotalTesis] = useState<number>(0);
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

  // Obtener lista y cantidad de libros
  const fetchLibros = async () => {
    setLoading(true);
    setError(null);
    const { data, error, count } = await supabase
      .from('Libros')
      .select('id_libro, titulo, sinopsis, type', { count: 'exact' });
    if (error) {
      setError('Error al obtener los libros');
      setLibros([]);
      setTotalLibros(0);
    } else {
      setLibros(data || []);
      setTotalLibros(count || 0);
      // Contar solo los libros de tipo 'Tesis'
      const tesisCount = (data || []).filter((libro: Libro) => libro.type === 'Tesis').length;
      setTotalTesis(tesisCount);
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
      <h1 className="text-4xl font-bold mb-8 text-center">Dashboard de Administrador</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Estadísticas generales */}
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold">Libros Totales</span>
          <span className="text-4xl font-bold text-blue-600 mt-2">
            {loading ? '...' : error ? 'Error' : totalLibros}
          </span>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold">Tesis Totales</span>
          <span className="text-4xl font-bold text-green-600 mt-2">
            {loading ? '...' : error ? 'Error' : totalTesis}
          </span>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold">Proyectos de Investigación</span>
          <span className="text-4xl font-bold text-orange-600 mt-2">0</span>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Gestión de Libros</h2>
        <p className="text-gray-600 mb-4">Aquí podrás ver, agregar, editar y eliminar libros.</p>
        <button
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancelar' : 'Agregar Libro'}
        </button>
        {showForm && (
          <form onSubmit={handleAddLibro} className="mb-6 flex flex-col gap-2">
            <input
              type="text"
              placeholder="Título"
              value={newTitulo}
              onChange={e => setNewTitulo(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <textarea
              placeholder="Sinopsis"
              value={newSinopsis}
              onChange={e => setNewSinopsis(e.target.value)}
              className="border p-2 rounded"
              required
            />
            {addError && <p className="text-red-500 text-sm">{addError}</p>}
            <button
              type="submit"
              className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
              disabled={addLoading}
            >
              {addLoading ? 'Agregando...' : 'Agregar'}
            </button>
          </form>
        )}
        {/* Cuadros de libros */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {libros.map((libro) => (
            <div
              key={libro.id_libro}
              className="bg-gray-100 rounded-lg shadow p-3 flex flex-col items-start min-h-[120px] max-h-[160px]"
              style={{ minHeight: 120, maxHeight: 160 }}
            >
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
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Reporte de Libros Más Descargados</h2>
        <p className="text-gray-600">Visualiza los libros más populares según descargas.</p>
        {/* Aquí irá la tabla o gráfica de libros más descargados */}
      </div>
    </div>
  );
};

export default AdminDashboard; 