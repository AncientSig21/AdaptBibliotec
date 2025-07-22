import { useEffect, useState } from 'react';
import { TesisBook } from '../interfaces';
import { CardBook } from '../components/products/CardBook';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchBooks } from '../services/bookService';
import { ContainerFilter } from '../components/products/ContainerFilter';
import { useAuth } from '../hooks/useAuth';

export const TesisPages = () => {
  const [books, setBooks] = useState<TesisBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<TesisBook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  // Lista fija de especialidades para los filtros
  const specialitiesForFilter = [
    'Tesis',
    'Pasantías',
    'Servicio Comunitario',
  ];

  // Función para normalizar textos (ignorar mayúsculas y tildes)
  function normalize(str: string) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Solo elimina tildes
      .trim();
  }

  // Log para ver los tipos normalizados
  console.log('Tipos normalizados:', books.map(b => b.type && normalize(b.type)));

  // Filtrar solo libros de tipo Tesis, Servicio Comunitario o Pasantía(s)
  let filteredBooks = books.filter(
    book =>
      book.type === 'Tesis' ||
      book.type === 'Servicio Comunitario' ||
      book.type === 'Pasantía' ||
      book.type === 'Pasantias'
  );

  // Filtrar por tipo seleccionado (igual que BookPages pero usando type)
  if (selectedSpecialities.length > 0) {
    console.log('selectedSpecialities:', selectedSpecialities);
    console.log('Book types:', filteredBooks.map(b => b.type));
    filteredBooks = filteredBooks.filter(book => {
      const result = selectedSpecialities.some(sel =>
        book.type && normalize(sel) === normalize(book.type)
      );
      console.log(
        `Comparando: filtro "${selectedSpecialities[0]}" con libro "${book.title}" (type: "${book.type}") =>`,
        result
      );
      return result;
    });
    console.log('Libros mostrados tras filtrar:', filteredBooks.map(b => ({ title: b.title, type: b.type })));
  }

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks();
        setBooks(data); // Mostrar todos los libros primero
      } catch (err: any) {
        setError('Error al cargar las tesis');
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 text-lg my-8">Cargando tesis...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 text-lg my-8">{error}</p>;
  }
  if (filteredBooks.length === 0) {
    return (
      <div className="my-32">
        <h1 className='text-5xl font-semibold text-center mb-12'>Tesis</h1>
        <p className="text-center text-gray-500 text-lg my-8">No hay libros disponibles.</p>
      </div>
    );
  }

  return (
    <div className="my-32">
      <h2 className="text-3xl font-semibold text-center mb-8 md:text-4xl lg:text-5xl">
        Tesis
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {/* Caja de filtros */}
        <ContainerFilter
          selectedSpecialities={selectedSpecialities}
          onChange={setSelectedSpecialities}
          specialities={specialitiesForFilter}
        />
        <div className="col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col gap-12">
          {filteredBooks.length === 0 ? (
            <div className="my-32">
              <p className="text-center text-gray-500 text-lg my-8">No hay tesis disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4">
              {filteredBooks.map(book => (
                <CardBook
                  key={book.id}
                  title={book.title}
                  authors={book.authors}
                  price={book.price}
                  img={book.coverImage}
                  slug={book.slug}
                  speciality={book.speciality}
                  type={book.type}
                  fragment={book.fragment}
                  fileUrl={book.fileUrl}
                  onViewDetails={() => setSelectedBook(book)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedBook && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedBook(null);
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-2 text-center">{selectedBook.title}</h3>
              <p className="text-center text-gray-700 mb-2">Autor: {selectedBook.authors}</p>
              <p className="text-lg font-semibold text-center mb-2 text-gray-800">Capítulo 1</p>
              <p className="text-gray-700 whitespace-pre-line mb-4">{(selectedBook.fragment || '').replace(/^Capítulo 1:?\s*/i, '') || 'No hay fragmento disponible.'}</p>
              {isAuthenticated ? (
                <a
                  href={selectedBook.fileUrl}
                  download
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                >
                  Descargar tesis
                </a>
              ) : (
                <p className="text-center text-red-500 font-semibold">Debes iniciar sesión para descargar el libro.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
