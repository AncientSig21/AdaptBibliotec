import { useQueries } from '@tanstack/react-query';
import { getBooks } from '../../actions/book';

export const useHomeBooks = () => {
	const results = useQueries({
		queries: [
			{
				queryKey: ['recentBooks'],
				queryFn: async () => {
					const books = await getBooks();
					// Retornar los 4 libros más recientes
					return books.slice(0, 4);
				},
			},
			{
				queryKey: ['popularBooks'],
				queryFn: async () => {
					const books = await getBooks();
					// Seleccionar 4 libros al azar para mostrar como destacados
					const randomBooks = books
						.sort(() => 0.5 - Math.random())
						.slice(0, 4);
					return randomBooks;
				},
			},
		],
	});

	const [recentBooksResult, popularBooksResult] = results;

	// Combinar los estados de las consultas
	const isLoading =
		recentBooksResult.isLoading || popularBooksResult.isLoading;
	const isError =
		recentBooksResult.isError || popularBooksResult.isError;

	return {
		recentBooks: recentBooksResult.data || [],
		popularBooks: popularBooksResult.data || [],
		isLoading,
		isError,
	};
}; 