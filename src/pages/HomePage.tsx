import { Brands } from '../components/home/Brands';
import { FeatureGrid } from '../components/home/FeatureGrid';
import { BookGrid } from '../components/home/BookGrid';
import {
	allBooks,
} from '../data/initialData';
import { prepareBooks } from '../helpers';

export const HomePage = () => {
	const preparedRecentProducts = prepareBooks(allBooks);
	const preparedPopularProducts = prepareBooks(allBooks);

	return (
		<div>
			<FeatureGrid />

			<BookGrid
				title='Nuevos Libros'
				books={preparedRecentProducts}
			/>

			<BookGrid
				title='Libros Destacados'
				books={preparedPopularProducts}
			/>

			<Brands />
		</div>
	);
};
