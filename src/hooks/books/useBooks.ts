import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../supabase/client';
import { Book } from '../../interfaces';

export const useBooks = () => {
	return useQuery({
		queryKey: ['books'],
		queryFn: async (): Promise<Book[]> => {
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
				.order('id_libro', { ascending: false });

			if (error) {
				throw new Error(error.message);
			}

			// Transformar los datos para que coincidan con la interfaz Book
			return data?.map((book: any) => ({
				id_libro: book.id_libro.toString(),
				titulo: book.titulo,
				fecha_publicacion: book.fecha_publicacion,
				sinopsis: book.sinopsis || 'Sin descripción disponible',
				url_portada: book.url_portada || undefined,
				created_at: book.fecha_publicacion, // Usar fecha_publicacion como created_at
				autores: book.libros_autores?.map((la: any) => ({
					id: la.autor_id.toString(),
					nombre: la.autor.nombre
				})) || [],
				libro_virtual: book.libros_virtuales?.[0] || undefined,
				libro_fisico: book.libros_fisicos?.[0] || undefined,
			})) || [];
		},
	});
}; 