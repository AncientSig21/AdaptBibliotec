import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';

const historialLibrosDemo: any[] = []; // Mantener vacío por ahora

const AdminReportsPage = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      setError(null);
      // Traer reservas de libros físicos y unir con Libros
      const { data, error } = await supabase
        .from('reservas')
        .select('id_reservas, libro_id, usuario_id, tipo_de_libro, "fecha _pedido", fecha_inicio, fecha_fin, estado, Libros(titulo)')
        .eq('tipo_de_libro', 'Fisico')
        .order('fecha _pedido', { ascending: false });
      if (error) {
        console.error('Error Supabase:', error); // Mostrar error real en consola
        setError('Error al obtener reservas');
        setReservas([]);
      } else {
        setReservas(data || []);
      }
      setLoading(false);
    };
    fetchReservas();
  }, []);

  // Función para actualizar el estado de la reserva
  const updateReservaEstado = async (id_reservas: number, nuevoEstado: string) => {
    const { error } = await supabase
      .from('reservas')
      .update({ estado: nuevoEstado } as any)
      .eq('id_reservas', id_reservas);
    if (!error) {
      setReservas(prev => prev.map(r => r.id_reservas === id_reservas ? { ...r, estado: nuevoEstado } : r));
    }
  };

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 bg-gray-50">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Reportes</h1>
      {/* Sección 1: Historial de libros */}
      <div className="bg-white rounded shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Historial de Libros</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">Fecha</th>
                <th className="p-2">Acción</th>
                <th className="p-2">Título</th>
                <th className="p-2">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {historialLibrosDemo.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="p-2">{item.fecha}</td>
                  <td className="p-2">
                    {item.accion === 'agregado' && <span className="text-green-600 font-bold">Agregado</span>}
                    {item.accion === 'editado' && <span className="text-yellow-600 font-bold">Editado</span>}
                    {item.accion === 'borrado' && <span className="text-red-600 font-bold">Borrado</span>}
                  </td>
                  <td className="p-2">{item.titulo}</td>
                  <td className="p-2">{item.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Sección 2: Historial de reservas de libros físicos */}
      <div className="bg-white rounded shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Historial de Reservas de Libros Físicos</h2>
        {loading ? (
          <div className="text-center text-gray-500">Cargando reservas...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Fecha de pedido</th>
                  <th className="p-2">Libro</th>
                  <th className="p-2">Usuario ID</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{item["fecha _pedido"] ? item["fecha _pedido"].substring(0, 10) : ''}</td>
                    <td className="p-2">{item.Libros?.titulo || item.libro_id}</td>
                    <td className="p-2">{item.usuario_id}</td>
                    <td className="p-2">
                      <span className={
                        item.estado === 'aceptada' ? 'text-green-600 font-bold' :
                        item.estado === 'rechazada' ? 'text-red-600 font-bold' :
                        'text-yellow-600 font-bold'
                      }>
                        {item.estado ? item.estado.charAt(0).toUpperCase() + item.estado.slice(1) : 'Pendiente'}
                      </span>
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      {item.estado === 'pendiente' && (
                        <>
                          <button
                            className="bg-green-600 text-white rounded px-2 py-1 text-xs hover:bg-green-700"
                            onClick={() => updateReservaEstado(item.id_reservas, 'aceptada')}
                          >✔️</button>
                          <button
                            className="bg-red-600 text-white rounded px-2 py-1 text-xs hover:bg-red-700"
                            onClick={() => updateReservaEstado(item.id_reservas, 'rechazada')}
                          >❌</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-white rounded shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Reporte de Libros Más Descargados</h2>
        <p className="text-gray-600">Visualiza los libros más populares según descargas. (Próximamente)</p>
      </div>
    </div>
  );
};

export default AdminReportsPage; 