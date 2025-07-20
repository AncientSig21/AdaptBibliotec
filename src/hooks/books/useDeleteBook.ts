import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import toast from 'react-hot-toast';

export const useDeleteBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (bookId: string) => {
			// Eliminar relaciones de autores primero
			await supabase
				.from('libros_autores')
				.delete()
				.eq('libro_id', parseInt(bookId));

			// Eliminar libros virtuales
			await supabase
				.from('libros_virtuales')
				.delete()
				.eq('libro_id', parseInt(bookId));

			// Eliminar libros físicos
			await supabase
				.from('libros_fisicos')
				.delete()
				.eq('libro_id', parseInt(bookId));

			// Finalmente eliminar el libro principal
			const { error } = await supabase
				.from('Libros')
				.delete()
				.eq('id_libro', parseInt(bookId));

			if (error) {
				throw new Error(error.message);
			}

			return bookId;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['books'] });
			toast.success('Libro eliminado exitosamente');
		},
		onError: (error: Error) => {
			toast.error(`Error al eliminar libro: ${error.message}`);
		},
	});
}; 