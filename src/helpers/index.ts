import { PreparedBook } from '../interfaces';

export const prepareBooks = (rawBooks: any[]): PreparedBook[] => {
	return rawBooks.map(book => ({
		id: book.id,
		title: book.title,
		author: book.author,
		slug: book.slug,
		features: book.features ?? [],
		description: book.description,
		coverImage: book.coverImage ?? book.images?.[0] ?? '',
		created_at: book.created_at,
		price: book.price ?? 0,

		// Nuevos campos:
		type: book.type ?? 'Físico', // valor por defecto si falta
		speciality: book.speciality ?? 'Ingeniería en Sistemas', // valor por defecto si falta
	}));
};
