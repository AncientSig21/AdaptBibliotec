import { useTestConnection } from '../hooks/books/useTestConnection';

export const TestPage = () => {
	const { data, isLoading, error } = useTestConnection();

	return (
		<div className='p-8'>
			<h1 className='text-2xl font-bold mb-4'>Test de Conexión Supabase</h1>
			
			<div className='space-y-4'>
				<div>
					<h2 className='text-lg font-semibold'>Variables de Entorno:</h2>
					<p>VITE_PROJECT_URL_SUPABASE: {import.meta.env.VITE_PROJECT_URL_SUPABASE || 'No configurado'}</p>
					<p>VITE_SUPABASE_API_KEY: {import.meta.env.VITE_SUPABASE_API_KEY ? 'Configurado' : 'No configurado'}</p>
				</div>

				<div>
					<h2 className='text-lg font-semibold'>Estado de la Conexión:</h2>
					{isLoading && <p className='text-blue-600'>Probando conexión...</p>}
					{error && <p className='text-red-600'>Error: {error.message}</p>}
					{data && <p className='text-green-600'>Conexión exitosa!</p>}
				</div>

				<div>
					<h2 className='text-lg font-semibold'>Datos de Prueba:</h2>
					<pre className='bg-gray-100 p-4 rounded'>
						{JSON.stringify(data, null, 2)}
					</pre>
				</div>
			</div>
		</div>
	);
}; 