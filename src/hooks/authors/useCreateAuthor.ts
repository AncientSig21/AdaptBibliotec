import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { AuthorInput } from '../../interfaces';
import toast from 'react-hot-toast';

export const useCreateAuthor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (authorData: AuthorInput) => {
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

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['authors'] });
			toast.success('Autor creado exitosamente');
		},
		onError: (error: Error) => {
			toast.error(`Error al crear autor: ${error.message}`);
		},
	});
}; 