import { supabase } from '../supabase/client';

export const fetchBooks = async () => {
  // Traer libros y, si es tesis, buscar su PDF en libros_virtuales
  const { data, error } = await supabase
    .from('Libros')
    .select('id_libro, titulo, fecha_publicacion, sinopsis, url_portada, tipo, especialidad, libros_autores(autor:autor_id(nombre)), libros_virtuales:libros_virtuales(direccion_del_libro), libros_fisicos(cantidad)');
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
    // Obtener cantidad disponible de libros físicos (si aplica)
    let cantidadDisponible = undefined;
    if (book.tipo === 'Físico' && book.libros_fisicos && book.libros_fisicos.length > 0) {
      cantidadDisponible = book.libros_fisicos[0].cantidad;
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
      cantidadDisponible,
    };
  });
};

export const registerBookReservation = async ({ libro_id, usuario_id }: { libro_id: number, usuario_id: number }) => {
  // Fecha actual en formato ISO
  const fechaPedido = new Date().toISOString();
  const reservaObj = {
    libro_id,
    usuario_id,
    tipo_de_libro: 'Físico',
    "fecha _pedido": fechaPedido,
    fecha_inicio: null,
    fecha_fin: null,
    estado: 'pendiente',
  };
  console.log('[Reserva] Objeto enviado a Supabase:', reservaObj);
  const { data, error } = await supabase
    .from('reservas')
    .insert(reservaObj as any);
  if (error) throw error;
  return data;
}; 