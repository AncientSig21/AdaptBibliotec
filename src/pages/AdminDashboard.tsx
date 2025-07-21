import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center">Dashboard de Administrador</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Estadísticas generales */}
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold">Libros Totales</span>
          <span className="text-4xl font-bold text-blue-600 mt-2">0</span>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold">Tesis Totales</span>
          <span className="text-4xl font-bold text-green-600 mt-2">0</span>
        </div>
        <div className="bg-white rounded shadow p-6 flex flex-col items-center">
          <span className="text-2xl font-semibold">Proyectos de Investigación</span>
          <span className="text-4xl font-bold text-orange-600 mt-2">0</span>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6 mb-12">
        <h2 className="text-2xl font-bold mb-4">Gestión de Libros</h2>
        <p className="text-gray-600">Aquí podrás ver, agregar, editar y eliminar libros.</p>
        {/* Aquí irá la tabla/listado de libros y acciones CRUD */}
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