import { CardBook } from '../components/products/CardBook.tsx';
import { ContainerFilter } from '../components/products/ContainerFilter';
import { allBooks } from '../data/initialData';
import { prepareBooks } from '../helpers';

export const BookPages = () => {
	const preparedBooks = prepareBooks(allBooks); // ✅ nombre en minúscula y correcto

	return (
		<>
			<h1 className='text-5xl font-semibold text-center mb-12'>
				Libros
			</h1>

			<div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
				{/* FILTROS */}
				<ContainerFilter />

				<div className='col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-12'>
					<div className='grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4'>
						{preparedBooks.map(book => (
							<CardBook
								key={book.id}
								title={book.title}
								author={book.author}
								price={book.price}
								img={book.coverImage}
								slug={book.slug}
								speciality={book.speciality}
								type = {book.type}
							/>
						))}
					</div>

					{/* TODO: Paginación */}
				</div>
			</div>
		</>
	);
};
