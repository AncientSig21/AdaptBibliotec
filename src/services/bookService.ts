import { supabase } from '../supabase/client';

export const fetchBooks = async () => {
  const { data, error } = await supabase
    .from('Libros')
    .select('id_libro, titulo, fecha_publicacion, sinopsis, url_portada, tipo, especialidad, libros_autores(autor:autor_id(nombre))');
  if (error) {
    throw error;
  }

  return (data || []).map((book: any) => ({
    id: book.id_libro,
    title: book.titulo,
    authors: book.libros_autores && book.libros_autores.length > 0
      ? book.libros_autores.map((a: any) => a.autor.nombre).join(', ')
      : 'Desconocido',
    author: book.libros_autores && book.libros_autores.length > 0
      ? book.libros_autores[0].autor.nombre
      : 'Desconocido',
    slug: book.titulo.toLowerCase().replace(/\s+/g, '-'),
    features: [],
    description: { content: [{ type: 'paragraph', content: [{ type: 'text', text: book.sinopsis || '' }] }] },
    coverImage: book.url_portada,
    created_at: book.fecha_publicacion,
    price: 0,
    type: book.tipo,
    speciality: book.especialidad || '',
    fragment: '',
    fileUrl: '',
  }));
}; 