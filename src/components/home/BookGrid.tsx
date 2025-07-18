import { PreparedBook } from '../../interfaces';
import { CardBook } from '../products/CardBook';

interface Props {
	title: string;
	books: PreparedBook[];
}

export const BookGrid = ({ title, books }: Props) => {
	return (
		<div className='my-32'>
			<h2 className='text-3xl font-semibold text-center mb-8 md:text-4xl lg:text-5xl'>
				{title}
			</h2>

			<div className='grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'>
				{books.map(book => (
					<CardBook
						key={book.id}
						title={book.title}
						author={book.author}
						price={book.price ?? 0}
						img={book.coverImage}
						slug={book.slug}
					/>
				))}
			</div>
		</div>
	);
};
