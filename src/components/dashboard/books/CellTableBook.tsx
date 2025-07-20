import { Link } from 'react-router-dom';
import { IoIosCreate, IoIosTrash } from 'react-icons/io';
import { Book } from '../../../interfaces';
import { useDeleteBook } from '../../../hooks';
import toast from 'react-hot-toast';

interface Props {
	book: Book;
}

export const CellTableBook = ({ book }: Props) => {
	const { mutate: deleteBook, isPending } = useDeleteBook();

	const handleDelete = () => {
		if (confirm('¿Estás seguro de que quieres eliminar este libro?')) {
			deleteBook(book.id_libro);
		}
	};

	const getTipoLibro = () => {
		if (book.libro_virtual && book.libro_fisico) return 'Ambos';
		if (book.libro_virtual) return 'Virtual';
		if (book.libro_fisico) return 'Físico';
		return 'No especificado';
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-ES');
	};

	return (
		<tr className='hover:bg-slate-50'>
			<td className='px-6 py-4 whitespace-nowrap'>
				<div className='text-sm font-medium text-slate-900'>
					{book.titulo}
				</div>
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				<div className='text-sm text-slate-600'>
					{book.autores.map(author => author.nombre).join(', ')}
				</div>
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				<div className='text-sm text-slate-600'>
					{formatDate(book.fecha_publicacion)}
				</div>
			</td>
			<td className='px-6 py-4 whitespace-nowrap'>
				<span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'>
					{getTipoLibro()}
				</span>
			</td>
			<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
				<div className='flex gap-2'>
					<Link
						to={`/dashboard/books/${book.id_libro}`}
						className='text-blue-600 hover:text-blue-900'
					>
						<IoIosCreate size={18} />
					</Link>
					<button
						onClick={handleDelete}
						disabled={isPending}
						className='text-red-600 hover:text-red-900 disabled:opacity-50'
					>
						<IoIosTrash size={18} />
					</button>
				</div>
			</td>
		</tr>
	);
}; 