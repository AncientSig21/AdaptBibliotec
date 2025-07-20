import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { BookInput } from '../../interfaces';
import toast from 'react-hot-toast';

export const useCreateBook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (bookData: BookInput) => {
			// Crear el libro principal
			const { data: libroData, error: libroError } = await supabase
				.from('Libros')
				.insert({
					titulo: bookData.titulo,
					fecha_publicacion: bookData.fecha_publicacion,
					sinopsis: bookData.sinopsis,
					url_portada: bookData.url_portada || null,
				})
				.select()
				.single();

			if (libroError) {
				throw new Error(libroError.message);
			}

			// Crear relaciones con autores
			if (bookData.autores.length > 0) {
				const autoresData = bookData.autores.map(autorId => ({
					libro_id: libroData.id_libro,
					autor_id: parseInt(autorId)
				}));

				const { error: autoresError } = await supabase
					.from('libros_autores')
					.insert(autoresData);

				if (autoresError) {
					throw new Error(autoresError.message);
				}
			}

			// Crear libro virtual si es necesario
			if (bookData.tipo_libro === 'virtual' || bookData.tipo_libro === 'ambos') {
				if (bookData.direccion_virtual) {
					const { error: virtualError } = await supabase
						.from('libros_virtuales')
						.insert({
							libro_id: libroData.id_libro,
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
							libro_id: libroData.id_libro,
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
			toast.success('Libro creado exitosamente');
		},
		onError: (error: Error) => {
			toast.error(`Error al crear libro: ${error.message}`);
		},
	});
}; 