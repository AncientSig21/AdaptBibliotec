import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/client';

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
      {error && <div className="text-center text-red-500">{error}</div>}
    </div>
  );
};

export default AdminStatsPage; 