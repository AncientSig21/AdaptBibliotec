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
	}));
};

export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
};
