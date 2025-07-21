import { createClient } from '@supabase/supabase-js';
import { Database } from '../supabase/supabase';
import { PreparedBook } from '../interfaces/product.interface';

const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabaseUrl = import.meta.env.VITE_PROJECT_URL_SUPABASE;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const bookService = {
  async getBooks(): Promise<{ data: PreparedBook[]; error: any }> {
    const { data, error } = await supabase.from('Libros').select('*');
    if (error) return { data: [], error };

    // Mapea los datos de la base a PreparedBook
    const mapped = (data || []).map((row: any) => ({
      id: String(row.id_libro),
      title: row.titulo,
      author: '', // Si tienes relación con autores, aquí puedes hacer un join o consulta adicional
      slug: '',   // Si tienes un campo slug, mapea aquí
      features: [], // Si tienes features, mapea aquí
      description: row.sinopsis,
      coverImage: row.url_portada || '',
      created_at: row.fecha_publicacion,
      price: undefined, // Si tienes precio, mapea aquí
      type: 'Físico', // O 'Virtual', según tu lógica o tabla relacionada
      speciality: '', // Si tienes especialidad, mapea aquí
      fragment: '', // Si tienes fragmento, mapea aquí
      fileUrl: '', // Si tienes url de descarga, mapea aquí
    }));
    return { data: mapped, error: null };
  }
}; 