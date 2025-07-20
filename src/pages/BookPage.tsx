import { useParams } from 'react-router-dom';
import { useBook } from '../hooks';
import { Tag } from '../components/shared/Tag';

export const BookPage = () => {
	const { id } = useParams();
	const { data: book, isLoading, error } = useBook(id || '');

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-[500px]'>
				<p className='text-2xl'>Cargando...</p>
			</div>
		);
	}

	if (error || !book) {
		return (
			<div className='flex items-center justify-center h-[500px]'>
				<p className='text-2xl'>Libro no encontrado</p>
			</div>
		);
	}

	const isAvailable = (book.libro_fisico?.cantidad || 0) > 0 || book.libro_virtual;

	return (
		<div className='max-w-6xl mx-auto px-4 py-8'>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				{/* Imagen del libro */}
				<div className='flex justify-center'>
					{book.url_portada ? (
						<img
							src={book.url_portada}
							alt={book.titulo}
							className='max-w-md w-full h-auto rounded-lg shadow-lg'
						/>
					) : (
						<div className='w-full max-w-md h-96 bg-gray-200 rounded-lg flex items-center justify-center'>
							<span className='text-gray-500 text-lg'>Sin portada</span>
						</div>
					)}
				</div>

				{/* Información del libro */}
				<div className='flex flex-col gap-6'>
					<div>
						<h1 className='text-4xl font-bold mb-4'>{book.titulo}</h1>
						
						{book.autores.length > 0 && (
							<p className='text-xl text-gray-600 mb-4'>
								Por: {book.autores.map(autor => autor.nombre).join(', ')}
							</p>
						)}

						{book.fecha_publicacion && (
							<p className='text-gray-500 mb-4'>
								Publicado: {new Date(book.fecha_publicacion).getFullYear()}
							</p>
						)}
					</div>

					{/* Tags de tipo de libro */}
					<div className='flex gap-2'>
						{book.libro_fisico && (
							<Tag contentTag='Disponible en físico' />
						)}
						{book.libro_virtual && (
							<Tag contentTag='Disponible digital' />
						)}
						{!isAvailable && (
							<Tag contentTag='No disponible' />
						)}
					</div>

					{/* Sinopsis */}
					{book.sinopsis && (
						<div>
							<h3 className='text-xl font-semibold mb-2'>Sinopsis</h3>
							<p className='text-gray-700 leading-relaxed'>{book.sinopsis}</p>
						</div>
					)}

					{/* Información adicional */}
					<div className='space-y-4'>
						{book.libro_fisico && (
							<div>
								<h3 className='text-lg font-semibold mb-2'>Disponibilidad Física</h3>
								<p className='text-gray-700'>
									Cantidad disponible: {book.libro_fisico.cantidad} ejemplares
								</p>
							</div>
						)}

						{book.libro_virtual && (
							<div>
								<h3 className='text-lg font-semibold mb-2'>Versión Digital</h3>
								<p className='text-gray-700'>
									Disponible para lectura digital
								</p>
							</div>
						)}
					</div>

					{/* Botones de acción */}
					<div className='flex gap-4 pt-4'>
						{book.libro_fisico && book.libro_fisico.cantidad > 0 && (
							<button className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'>
								Reservar Ejemplar Físico
							</button>
						)}
						
						{book.libro_virtual && (
							<button className='bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors'>
								Leer Digital
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}; 