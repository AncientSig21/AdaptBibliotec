import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosAdd } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io';
import { CellTableBook } from './CellTableBook';
import { useBooks } from '../../../hooks';
import { Loader } from '../../shared/Loader';

export const TableBook = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const { data: books = [], isLoading } = useBooks();

	const filteredBooks = books.filter(book =>
		book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
		book.autores.some(author => author.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	if (isLoading) return <Loader />;

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-slate-900'>Libros</h1>
				<Link
					to='/dashboard/books/new'
					className='flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
				>
					<IoIosAdd size={20} />
					Agregar Libro
				</Link>
			</div>

			<div className='bg-white rounded-lg border border-slate-200'>
				<div className='p-6 border-b border-slate-200'>
					<div className='relative'>
						<IoIosSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400' size={20} />
						<input
							type='text'
							placeholder='Buscar libros por título o autor...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='w-full'>
						<thead className='bg-slate-50'>
							<tr>
								<th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
									Título
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
									Autores
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
									Fecha Publicación
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
									Tipo
								</th>
								<th className='px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider'>
									Acciones
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-slate-200'>
							{filteredBooks.map((book) => (
								<CellTableBook key={book.id_libro} book={book} />
							))}
						</tbody>
					</table>
				</div>

				{filteredBooks.length === 0 && (
					<div className='p-6 text-center text-slate-500'>
						{searchTerm ? 'No se encontraron libros que coincidan con la búsqueda.' : 'No hay libros registrados.'}
					</div>
				)}
			</div>
		</div>
	);
}; 