import { useEffect, useState } from 'react';
import { Brands } from '../components/home/Brands';
import { FeatureGrid } from '../components/home/FeatureGrid';
import { BookGrid } from '../components/home/BookGrid';
import {
	allBooks,
} from '../data/initialData';
import { fetchBooks } from '../services/bookService';
import { PreparedBook } from '../interfaces';

export const HomePage = () => {
	const [books, setBooks] = useState<PreparedBook[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadBooks = async () => {
			try {
				setLoading(true);
				const data = await fetchBooks();
				setBooks(data);
			} catch (err: any) {
				setError('Error al cargar los libros');
			} finally {
				setLoading(false);
			}
		};
		loadBooks();
	}, []);

	return (
		<div>
			<FeatureGrid />

			<Brands />
			{loading ? (
				<p className="text-center text-gray-500 text-lg my-8">Cargando libros…</p>
			) : error ? (
				<p className="text-center text-red-500 text-lg my-8">{error.replace('cargar los libros', 'cargar los libros')}</p>
			) : (
				<BookGrid
					title="Libros disponibles"
					books={books}
					noBooksMessage="No hay libros disponibles"
				/>
			)}
		</div>
	);
};
