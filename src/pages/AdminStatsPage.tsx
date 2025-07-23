import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell, TooltipProps } from 'recharts';

const AdminStatsPage = () => {
  const [totalLibros, setTotalLibros] = useState<number | null>(null);
  const [totalTesis, setTotalTesis] = useState<number | null>(null);
  const [totalProyectos, setTotalProyectos] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Libros totales
        const { count: librosCount, error: librosError } = await supabase
          .from('Libros')
          .select('id_libro', { count: 'exact', head: true });
        if (librosError) throw librosError;
        setTotalLibros(librosCount || 0);

        // Tesis totales (directo de la tabla 'tesis')
        const { count: tesisCount, error: tesisError } = await supabase
          .from('tesis')
          .select('id', { count: 'exact', head: true });
        if (tesisError) throw tesisError;
        setTotalTesis(tesisCount || 0);

        // Proyectos de investigación totales (directo de la tabla 'proyecto_investigacion')
        const { count: proyectosCount, error: proyectosError } = await supabase
          .from('proyecto_investigacion')
          .select('id', { count: 'exact', head: true });
        if (proyectosError) throw proyectosError;
        setTotalProyectos(proyectosCount || 0);
      } catch (err: any) {
        setError('Error al obtener estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Tooltip personalizado para la gráfica
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (active && payload && payload.length) {
      const label = payload[0].payload.name;
      let desc = '';
      if (label === 'Libros Totales') desc = 'Cantidad de libros totales';
      else if (label === 'Tesis') desc = 'Cantidad de tesis';
      else if (label === 'Proyectos de Investigación') desc = 'Cantidad de proyectos de investigación';
      return (
        <div className="bg-white p-2 rounded shadow text-xs border border-gray-200">
          <div className="font-semibold mb-1">{label}</div>
          <div>{desc}: <span className="font-bold">{payload[0].value}</span></div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8">
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
          <span className="text-4xl font-bold text-orange-600 mt-2">
            {loading ? '...' : error ? 'Error' : totalProyectos}
          </span>
        </div>
      </div>
      {/* Gráfica de barras */}
      <div className="bg-white rounded shadow p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">Gráfica de Libros, Tesis y Proyectos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: 'Libros Totales', value: totalLibros || 0, color: '#2563eb' },
            { name: 'Tesis', value: totalTesis || 0, color: '#22c55e' },
            { name: 'Proyectos de Investigación', value: totalProyectos || 0, color: '#f59e42' },
          ]}>
            <XAxis dataKey="name" tick={{ fontSize: 14 }} />
            <YAxis allowDecimals={false} />
            <Tooltip content={CustomTooltip} />
            <Bar dataKey="value">
              <Cell key="libros" fill="#2563eb" />
              <Cell key="tesis" fill="#22c55e" />
              <Cell key="proyectos" fill="#f59e42" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  );
};

export default AdminStatsPage; 