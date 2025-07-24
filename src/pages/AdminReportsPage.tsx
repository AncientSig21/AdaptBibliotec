import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import { useOutletContext } from 'react-router-dom';

// MODO DEMO: Cambia a true para simular datos locales
const DEMO_MODE = true;

// Datos ficticios para demo
const demoReservas = [
  {
    id_reservas: 1,
    libro_id: 101,
    usuario_id: 1,
    tipo_de_libro: 'Fisico',
    "fecha _pedido": dayjs().subtract(25, 'hour').toISOString(),
    fecha_inicio: null,
    fecha_fin: null,
    estado: 'Pendiente de buscar',
    Libros: { titulo: 'Cálculo I' },
  },
  {
    id_reservas: 2,
    libro_id: 102,
    usuario_id: 2,
    tipo_de_libro: 'Fisico',
    "fecha _pedido": dayjs().subtract(2, 'hour').toISOString(),
    fecha_inicio: dayjs().subtract(49, 'hour').toISOString(),
    fecha_fin: null,
    estado: 'Prestado',
    Libros: { titulo: 'Física General' },
  },
  {
    id_reservas: 3,
    libro_id: 103,
    usuario_id: 3,
    tipo_de_libro: 'Fisico',
    "fecha _pedido": dayjs().subtract(1, 'hour').toISOString(),
    fecha_inicio: null,
    fecha_fin: null,
    estado: 'Pendiente de buscar',
    Libros: { titulo: 'Álgebra Lineal' },
  },
];

const demoMorosos = [
  { id: 2, nombre: 'Juan Pérez', correo: 'juan@demo.com', estado: 'Moroso' },
];

// Hook para obtener y desbloquear usuarios morosos
function useMorosos() {
  const [morosos, setMorosos] = useState<any[]>([]);
  const [loadingMorosos, setLoadingMorosos] = useState(true);
  const [errorMorosos, setErrorMorosos] = useState<string | null>(null);

  const fetchMorosos = async () => {
    setLoadingMorosos(true);
    setErrorMorosos(null);
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nombre, correo, estado')
      .eq('estado', 'Moroso');
    if (error) {
      setErrorMorosos('Error al obtener usuarios morosos');
      setMorosos([]);
    } else {
      setMorosos(data || []);
    }
    setLoadingMorosos(false);
  };

  const desbloquearUsuario = async (id: number) => {
    const { error } = await supabase
      .from('usuarios')
      .update({ estado: 'Activo' })
      .eq('id', id);
    if (!error) {
      setMorosos(prev => prev.filter(u => u.id !== id));
    }
  };

  useEffect(() => {
    fetchMorosos();
  }, []);

  return { morosos, loadingMorosos, errorMorosos, desbloquearUsuario, fetchMorosos };
}

// Utilidades visuales para badges e iconos
const estadoBadge = {
  'Pendiente de buscar': 'bg-yellow-400 text-white',
  'Prestado': 'bg-blue-500 text-white',
  'Moroso': 'bg-red-500 text-white',
  'Completado': 'bg-green-500 text-white',
  'Cancelado': 'bg-gray-400 text-white',
} as const;
const estadoIcon = {
  'Pendiente de buscar': '🟡',
  'Prestado': '📘',
  'Moroso': '🔴',
  'Completado': '🟢',
  'Cancelado': '⚪',
} as const;

type EstadoReserva = keyof typeof estadoBadge;

const AdminReportsPage = () => {
  // Si está en modo demo, usar datos locales
  const [reservas, setReservas] = useState<any[]>(DEMO_MODE ? demoReservas : []);
  const [loading, setLoading] = useState(!DEMO_MODE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!DEMO_MODE) {
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
    }
  }, []);

  // Función para actualizar el estado de la reserva
  const updateReservaEstado = async (id_reservas: number, nuevoEstado: string) => {
    if (DEMO_MODE) {
      setReservas(prev => prev.map(r => r.id_reservas === id_reservas ? { ...r, estado: nuevoEstado } : r));
      // Si se responde un pedido pendiente (por ejemplo, cambia de 'Pendiente de buscar' a otro estado), disminuir contador
      const reserva = reservas.find(r => r.id_reservas === id_reservas);
      if (reserva && reserva.estado === 'Pendiente de buscar' && nuevoEstado !== 'Pendiente de buscar' && handlePedidoRespondido) {
        handlePedidoRespondido();
      }
      setMsg('Estado actualizado');
      setTimeout(() => setMsg(null), 2000);
      return;
    }
    const { error } = await supabase
      .from('reservas')
      .update({ estado: nuevoEstado } as any)
      .eq('id_reservas', id_reservas);
    if (!error) {
      setReservas(prev => prev.map(r => r.id_reservas === id_reservas ? { ...r, estado: nuevoEstado } : r));
    }
  };

  // Hook de morosos
  // En modo demo, usar datos locales para morosos
  const [morosos, setMorosos] = useState<any[]>(DEMO_MODE ? demoMorosos : []);
  const [loadingMorosos, setLoadingMorosos] = useState(false);
  const [errorMorosos, setErrorMorosos] = useState<string | null>(null);
  const desbloquearUsuario = async (id: number) => {
    if (DEMO_MODE) {
      setMorosos(prev => prev.filter(u => u.id !== id));
      if (handleMorosoDesbloqueado) handleMorosoDesbloqueado();
      setMsg('Usuario desbloqueado');
      setTimeout(() => setMsg(null), 2000);
      return;
    }
    // Real DB
    const { error } = await supabase
      .from('usuarios')
      .update({ estado: 'Activo' })
      .eq('id', id);
    if (!error) {
      setMorosos(prev => prev.filter(u => u.id !== id));
    }
  };

  // Estados posibles de una reserva
  const ESTADOS = [
    'Pendiente de buscar',
    'Prestado',
    'Completado',
    'Cancelado',
    'Moroso',
  ];

  // Función para saber si una reserva requiere atención
  function requiereAtencion(reserva: any) {
    if (reserva.estado === 'Pendiente de buscar' && reserva["fecha _pedido"]) {
      const fechaPedido = dayjs(reserva["fecha _pedido"]);
      return dayjs().diff(fechaPedido, 'hour') >= 24;
    }
    if (reserva.estado === 'Prestado' && reserva.fecha_inicio) {
      const fechaInicio = dayjs(reserva.fecha_inicio);
      return dayjs().diff(fechaInicio, 'hour') >= 48;
    }
    return false;
  }

  // Obtener funciones del layout para actualizar notificaciones
  const { handleMorosoDesbloqueado, handlePedidoRespondido } = useOutletContext<any>() || {};

  // Contadores para resumen superior
  const morososCount = morosos.length;
  const pendientesCount = reservas.filter(r => r.estado === 'Pendiente de buscar').length;
  const completadosCount = reservas.filter(r => r.estado === 'Completado').length;
  const [msg, setMsg] = useState<string|null>(null);

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 bg-gray-50">
      {/* Resumen superior */}
      <div className="flex gap-6 justify-center mb-8">
        <div className="flex flex-col items-center bg-white rounded-lg shadow p-4 w-32">
          <span className="text-2xl">🔴</span>
          <span className="text-2xl font-bold">{morososCount}</span>
          <span className="text-sm text-gray-700">Morosos</span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-lg shadow p-4 w-32">
          <span className="text-2xl">��</span>
          <span className="text-2xl font-bold">{pendientesCount}</span>
          <span className="text-sm text-gray-700">Pendientes</span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-lg shadow p-4 w-32">
          <span className="text-2xl">🟢</span>
          <span className="text-2xl font-bold">{completadosCount}</span>
          <span className="text-sm text-gray-700">Completados</span>
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center">Reportes</h1>
      {/* Sección 1: Historial de libros */}
      <div className="bg-white rounded shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Historial de Libros</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-100">
                <th className="p-2">Fecha</th>
                <th className="p-2">Acción</th>
                <th className="p-2">Título</th>
                <th className="p-2">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {/* Este bloque ahora es solo para demostración */}
            </tbody>
          </table>
        </div>
      </div>
      {/* Sección 2: Historial de reservas de libros físicos */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Historial de Reservas de Libros Físicos</h2>
        {loading ? (
          <div className="text-center text-gray-500">Cargando reservas...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="sticky top-0 z-10">
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
                  <tr key={idx} className={`border-b ${requiereAtencion(item) ? 'bg-yellow-100' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-cyan-50`}>
                    <td className="p-2">{item["fecha _pedido"] ? item["fecha _pedido"].substring(0, 10) : ''}</td>
                    <td className="p-2">{item.Libros?.titulo || item.libro_id}</td>
                    <td className="p-2">{item.usuario_id}</td>
                    <td className="p-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${estadoBadge[item.estado as EstadoReserva] || 'bg-gray-300 text-gray-700'}`}>
                        {estadoIcon[item.estado as EstadoReserva] || '❔'} {item.estado}
                      </span>
                    </td>
                    <td className="p-2 flex gap-2 justify-center">
                      <select
                        className="border rounded px-2 py-1 text-xs"
                        value={item.estado}
                        onChange={e => updateReservaEstado(item.id_reservas, e.target.value)}
                      >
                        {ESTADOS.map(estado => (
                          <option key={estado} value={estado}>{estado}</option>
                        ))}
                      </select>
                      {requiereAtencion(item) && (
                        <span className="ml-2 text-xs text-orange-600 font-bold">¡Requiere atención!</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Sección 3: Usuarios morosos */}
      <div className="bg-white rounded shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Usuarios bloqueados por morosidad</h2>
        {loadingMorosos ? (
          <div className="text-center text-gray-500">Cargando usuarios morosos...</div>
        ) : errorMorosos ? (
          <div className="text-center text-red-500">{errorMorosos}</div>
        ) : morosos.length === 0 ? (
          <div className="text-center text-green-600">No hay usuarios morosos actualmente.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-100">
                  <th className="p-2">ID</th>
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Correo</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Acción</th>
                </tr>
              </thead>
              <tbody>
                {morosos.map(usuario => (
                  <tr key={usuario.id} className="border-b hover:bg-red-50">
                    <td className="p-2">{usuario.id}</td>
                    <td className="p-2">{usuario.nombre}</td>
                    <td className="p-2">{usuario.correo}</td>
                    <td className="p-2 text-red-600 font-bold">{usuario.estado}</td>
                    <td className="p-2">
                      <button
                        className="bg-green-600 text-white rounded px-2 py-1 text-xs hover:bg-green-700"
                        onClick={async () => {
                          await desbloquearUsuario(usuario.id);
                          // En modo demo, no llamar a fetchMorosos()
                        }}
                      >Desbloquear</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Notificaciones flotantes */}
      <div className="fixed top-20 right-6 flex flex-col gap-2 z-50">
        {morososCount > 0 && (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white text-lg font-bold shadow-lg" title="Usuarios morosos">{morososCount}</span>
        )}
        {pendientesCount > 0 && (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-gray-800 text-lg font-bold shadow-lg" title="Pedidos por responder">{pendientesCount}</span>
        )}
      </div>
      {/* Mensaje de feedback */}
      {msg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded shadow-lg z-50 animate-fade-in">
          {msg}
        </div>
      )}
      <div className="bg-white rounded shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Reporte de Libros Más Descargados</h2>
        <p className="text-gray-600">Visualiza los libros más populares según descargas. (Próximamente)</p>
      </div>
    </div>
  );
};

export default AdminReportsPage; 