const categories = [
	{
		title: 'Ficción',
		description: 'Novelas y cuentos',
	},
	{
		title: 'No Ficción',
		description: 'Biografías y ensayos',
	},
	{
		title: 'Ciencia',
		description: 'Investigación y tecnología',
	},
	{
		title: 'Historia',
		description: 'Eventos y personajes',
	},
	{
		title: 'Filosofía',
		description: 'Pensamiento y reflexión',
	},
	{
		title: 'Arte',
		description: 'Cultura y expresión',
	},
];

export const Brands = () => {
	return (
		<div className='flex flex-col items-center gap-3 pt-16 pb-12'>
			<h2 className='font-bold text-2xl'>Categorías de Libros</h2>

			<p className='w-2/3 text-center text-sm md:text-base'>
				Explora nuestra amplia colección de libros organizados por categorías
			</p>

			<div className='grid grid-cols-2 gap-6 mt-8 items-center md:grid-cols-3 lg:grid-cols-6'>
				{categories.map((category, index) => (
					<div key={index} className='text-center p-4 bg-gray-50 rounded-lg'>
						<h3 className='font-semibold text-sm'>{category.title}</h3>
						<p className='text-xs text-gray-600 mt-1'>{category.description}</p>
					</div>
				))}
			</div>
		</div>
	);
};
