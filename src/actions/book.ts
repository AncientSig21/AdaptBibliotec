import { supabase } from '../supabase/client';
import { Book, BookInput, Author, AuthorInput } from '../interfaces';

export const getBooks = async (): Promise<Book[]> => {
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
		console.error('Error fetching books:', error);
		throw new Error(error.message);
	}

	console.log('Books data:', data);

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
};

export const getBook = async (id: string): Promise<Book | null> => {
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
		console.error('Error fetching book:', error);
		throw new Error(error.message);
	}

	if (!data) return null;

	console.log('Book data:', data);

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
};

export const createBook = async (bookData: BookInput): Promise<Book> => {
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

	// Retornar el libro creado con la estructura esperada
	return {
		id_libro: libroData.id_libro.toString(),
		titulo: libroData.titulo,
		fecha_publicacion: libroData.fecha_publicacion,
		sinopsis: libroData.sinopsis || 'Sin descripción disponible',
		created_at: libroData.fecha_publicacion,
		autores: [], // Los autores se cargarán en una consulta separada
		libro_virtual: undefined,
		libro_fisico: undefined,
	};
};

export const updateBook = async (id: string, bookData: BookInput): Promise<Book> => {
			// Actualizar el libro principal
		const { data: libroData, error: libroError } = await supabase
			.from('Libros')
			.update({
				titulo: bookData.titulo,
				fecha_publicacion: bookData.fecha_publicacion,
				sinopsis: bookData.sinopsis,
				url_portada: bookData.url_portada || null,
			})
			.eq('id_libro', parseInt(id))
			.select()
			.single();

	if (libroError) {
		throw new Error(libroError.message);
	}

	// Eliminar relaciones de autores existentes
	await supabase
		.from('libros_autores')
		.delete()
		.eq('libro_id', parseInt(id));

	// Crear nuevas relaciones con autores
	if (bookData.autores.length > 0) {
		const autoresData = bookData.autores.map(autorId => ({
			libro_id: parseInt(id),
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
		.eq('libro_id', parseInt(id));

	await supabase
		.from('libros_fisicos')
		.delete()
		.eq('libro_id', parseInt(id));

	// Crear libro virtual si es necesario
	if (bookData.tipo_libro === 'virtual' || bookData.tipo_libro === 'ambos') {
		if (bookData.direccion_virtual) {
			const { error: virtualError } = await supabase
				.from('libros_virtuales')
				.insert({
					libro_id: parseInt(id),
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
					libro_id: parseInt(id),
					cantidad: bookData.cantidad_fisica
				});

			if (fisicoError) {
				throw new Error(fisicoError.message);
			}
		}
	}

	// Retornar el libro actualizado con la estructura esperada
	return {
		id_libro: libroData.id_libro.toString(),
		titulo: libroData.titulo,
		fecha_publicacion: libroData.fecha_publicacion,
		sinopsis: libroData.sinopsis || 'Sin descripción disponible',
		created_at: libroData.fecha_publicacion,
		autores: [], // Los autores se cargarán en una consulta separada
		libro_virtual: undefined,
		libro_fisico: undefined,
	};
};

export const deleteBook = async (id: string): Promise<void> => {
	// Eliminar relaciones de autores primero
	await supabase
		.from('libros_autores')
		.delete()
		.eq('libro_id', parseInt(id));

	// Eliminar libros virtuales
	await supabase
		.from('libros_virtuales')
		.delete()
		.eq('libro_id', parseInt(id));

	// Eliminar libros físicos
	await supabase
		.from('libros_fisicos')
		.delete()
		.eq('libro_id', parseInt(id));

	// Finalmente eliminar el libro principal
	const { error } = await supabase
		.from('Libros')
		.delete()
		.eq('id_libro', parseInt(id));

	if (error) {
		throw new Error(error.message);
	}
}; 