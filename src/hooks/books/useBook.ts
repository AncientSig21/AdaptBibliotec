import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { Book } from '../../interfaces';

export const useBook = (id: string) => {
	return useQuery({
		queryKey: ['book', id],
		queryFn: async (): Promise<Book | null> => {
			if (!id) return null;

			const { data, error } = await supabase
				.from('Libros')
				.select(`
					*,
					libros_autores(
						autor_id,
						autor(nombre)
					),
					libros_virtuales(*),
					libros_fisicos(*)
				`)
				.eq('id_libro', id)
				.single();

			if (error) {
				throw new Error(error.message);
			}

			if (!data) return null;

			// Transformar los datos para que coincidan con la interfaz Book
			return {
				id_libro: data.id_libro.toString(),
				titulo: data.titulo,
				fecha_publicacion: data.fecha_publicacion,
				sinopsis: data.sinopsis || 'Sin descripción disponible',
				url_portada: data.url_portada || undefined,
				created_at: data.fecha_publicacion, // Usar fecha_publicacion como created_at
				autores: data.libros_autores?.map((la: any) => ({
					id: la.autor_id.toString(),
					nombre: la.autor.nombre
				})) || [],
				libro_virtual: data.libros_virtuales?.[0] || undefined,
				libro_fisico: data.libros_fisicos?.[0] || undefined,
			};
		},
		enabled: !!id,
	});
}; 