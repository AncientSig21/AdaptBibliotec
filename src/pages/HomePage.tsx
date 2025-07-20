import { Brands } from '../components/home/Brands';
import { FeatureGrid } from '../components/home/FeatureGrid';
import { BookGrid } from '../components/home/BookGrid';
import { BookGridSkeleton } from '../components/skeletons/BookGridSkeleton';
import { useHomeBooks } from '../hooks';

export const HomePage = () => {
	const { recentBooks, popularBooks, isLoading } =
		useHomeBooks();

	return (
		<div>
			<FeatureGrid />

			{isLoading ? (
				<BookGridSkeleton numberOfBooks={4} />
			) : (
				<BookGrid
					title='Nuevos Libros'
					books={recentBooks}
				/>
			)}

			{isLoading ? (
				<BookGridSkeleton numberOfBooks={4} />
			) : (
				<BookGrid
					title='Libros Destacados'
					books={popularBooks}
				/>
			)}

			<Brands />
		</div>
	);
};
