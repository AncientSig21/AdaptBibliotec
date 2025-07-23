import { supabase } from '../supabase/client';

export const fetchBooks = async () => {
  // Traer libros y, si es tesis, buscar su PDF en libros_virtuales
  const { data, error } = await supabase
    .from('Libros')
    .select('id_libro, titulo, fecha_publicacion, sinopsis, url_portada, tipo, especialidad, libros_autores(autor:autor_id(nombre)), libros_virtuales:libros_virtuales(direccion_del_libro)');
  if (error) {
    throw error;
  }

  console.log('[IA] Datos crudos de libros desde la BDD:', data);

  return (data || []).map((book: any) => {
    // Si es tesis, buscar el PDF en libros_virtuales
    let fileUrl = '';
    if (book.tipo === 'Tesis' && book.libros_virtuales && book.libros_virtuales.length > 0) {
      const rawUrl = book.libros_virtuales[0].direccion_del_libro;
      // Si la URL ya es pública, usarla tal cual. Si es solo la ruta, construir la URL pública.
      if (rawUrl && rawUrl.startsWith('http')) {
        fileUrl = rawUrl;
      } else if (rawUrl) {
        // Construir la URL pública
        fileUrl = `https://ueufprdedokleqlyooyq.supabase.co/storage/v1/object/public/${rawUrl}`;
      }
    }
    return {
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
      fileUrl,
      sinopsis: book.sinopsis || '',
    };
  });
}; 