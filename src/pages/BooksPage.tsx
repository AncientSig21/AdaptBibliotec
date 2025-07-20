import { useState } from 'react';
import { CardBook } from '../components/products/CardBook';
import { Book } from '../interfaces';
import { useBooks } from '../hooks';
import { Pagination } from '../components/shared/Pagination';

export const BooksPage = () => {
	const [page, setPage] = useState(1);
	const itemsPerPage = 12;
	const { data: books = [], isLoading } = useBooks();

	// Paginación simple
	const totalBooks = books.length;
	const totalPages = Math.ceil(totalBooks / itemsPerPage);
	const startIndex = (page - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentBooks = books.slice(startIndex, endIndex);

	return (
		<>
			<h1 className='text-5xl font-semibold text-center mb-12'>
				Biblioteca Virtual
			</h1>

			{isLoading ? (
				<div className='flex items-center justify-center h-[500px]'>
					<p className='text-2xl'>Cargando...</p>
				</div>
			) : (
				<div className='flex flex-col gap-12'>
					<div className='grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4'>
						{currentBooks.map(book => (
							<CardBook
								key={book.id_libro}
								book={book}
							/>
						))}
					</div>

					{totalPages > 1 && (
						<Pagination
							totalItems={totalBooks}
							page={page}
							setPage={setPage}
						/>
					)}
				</div>
			)}
		</>
	);
}; 