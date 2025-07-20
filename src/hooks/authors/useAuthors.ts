import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { Author } from '../../interfaces';

export const useAuthors = () => {
	return useQuery({
		queryKey: ['authors'],
		queryFn: async (): Promise<Author[]> => {
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
		},
	});
}; 