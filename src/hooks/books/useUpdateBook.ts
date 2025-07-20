import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { BookInput } from '../../interfaces';
import toast from 'react-hot-toast';

export const useUpdateBook = (bookId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (bookData: BookInput) => {
			// Actualizar el libro principal
			const { data: libroData, error: libroError } = await supabase
				.from('Libros')
				.update({
					titulo: bookData.titulo,
					fecha_publicacion: bookData.fecha_publicacion,
					sinopsis: bookData.sinopsis,
					url_portada: bookData.url_portada || null,
				})
				.eq('id_libro', parseInt(bookId))
				.select()
				.single();

			if (libroError) {
				throw new Error(libroError.message);
			}

			// Eliminar relaciones de autores existentes
			await supabase
				.from('libros_autores')
				.delete()
				.eq('libro_id', parseInt(bookId));

			// Crear nuevas relaciones con autores
			if (bookData.autores.length > 0) {
				const autoresData = bookData.autores.map(autorId => ({
					libro_id: parseInt(bookId),
					autor_id: parseInt(autorId)
				}));

				const { error: autoresError } = await supabase
					.from('libros_autores')
					.insert(autoresData);

				if (autoresError) {
					throw new Error(autoresError.message);
				}
			}

			// Eliminar libros virtuales y físicos existentes
			await supabase
				.from('libros_virtuales')
				.delete()
				.eq('libro_id', parseInt(bookId));

			await supabase
				.from('libros_fisicos')
				.delete()
				.eq('libro_id', parseInt(bookId));

			// Crear libro virtual si es necesario
			if (bookData.tipo_libro === 'virtual' || bookData.tipo_libro === 'ambos') {
				if (bookData.direccion_virtual) {
					const { error: virtualError } = await supabase
						.from('libros_virtuales')
						.insert({
							libro_id: parseInt(bookId),
							direccion_del_libro: bookData.direccion_virtual
						});

					if (virtualError) {
						throw new Error(virtualError.message);
					}
				}
			}

			// Crear libro físico si es necesario
			if (bookData.tipo_libro === 'fisico' || bookData.tipo_libro === 'ambos') {
				if (bookData.cantidad_fisica) {
					const { error: fisicoError } = await supabase
						.from('libros_fisicos')
						.insert({
							libro_id: parseInt(bookId),
							cantidad: bookData.cantidad_fisica
						});

					if (fisicoError) {
						throw new Error(fisicoError.message);
					}
				}
			}

			return libroData;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['books'] });
			queryClient.invalidateQueries({ queryKey: ['book', bookId] });
			toast.success('Libro actualizado exitosamente');
		},
		onError: (error: Error) => {
			toast.error(`Error al actualizar libro: ${error.message}`);
		},
	});
}; 