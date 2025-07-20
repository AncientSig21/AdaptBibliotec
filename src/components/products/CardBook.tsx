import { Link } from 'react-router-dom';
import { Book } from '../../interfaces';
import { Tag } from '../shared/Tag';

interface Props {
	book: Book;
}

export const CardBook = ({ book }: Props) => {
	const isAvailable = (book.libro_fisico?.cantidad || 0) > 0 || book.libro_virtual;

	return (
		<div className='flex flex-col gap-6 relative'>
			<Link
				to={`/libros/${book.id_libro}`}
				className='flex relative group overflow-hidden'
			>
				<div className='flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]'>
					{book.url_portada ? (
						<img
							src={book.url_portada}
							alt={book.titulo}
							className='object-cover h-full w-full rounded-lg'
						/>
					) : (
						<div className='w-full h-full bg-gray-200 rounded-lg flex items-center justify-center'>
							<span className='text-gray-500 text-sm'>Sin portada</span>
						</div>
					)}
				</div>
			</Link>

			<div className='flex flex-col gap-2 items-center text-center'>
				<h3 className='text-[15px] font-medium line-clamp-2'>{book.titulo}</h3>
				
				{book.autores.length > 0 && (
					<p className='text-[13px] text-gray-600'>
						{book.autores.map(autor => autor.nombre).join(', ')}
					</p>
				)}

				<div className='flex gap-2 flex-wrap justify-center'>
					{book.libro_fisico && (
						<Tag contentTag='fisico' />
					)}
					{book.libro_virtual && (
						<Tag contentTag='digital' />
					)}
				</div>

				{book.sinopsis && (
					<p className='text-[12px] text-gray-500 line-clamp-2 max-w-[200px]'>
						{book.sinopsis}
					</p>
				)}
			</div>

			<div className='absolute top-2 left-2'>
				{!isAvailable && <Tag contentTag='no disponible' />}
			</div>
		</div>
	);
}; 