import { supabase } from '../supabase/client';
import { Author, AuthorInput } from '../interfaces';

export const getAuthors = async (): Promise<Author[]> => {
	const { data, error } = await supabase
		.from('autor')
		.select('*')
		.order('nombre', { ascending: true });

	if (error) {
		throw new Error(error.message);
	}

	return data?.map((autor: any) => ({
		id: autor.id.toString(),
		nombre: autor.nombre,
	})) || [];
};

export const createAuthor = async (authorData: AuthorInput): Promise<Author> => {
	const { data, error } = await supabase
		.from('autor')
		.insert({
			nombre: authorData.nombre,
		})
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return {
		id: data.id.toString(),
		nombre: data.nombre,
	};
}; 