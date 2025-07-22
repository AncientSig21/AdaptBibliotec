import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PreparedBook } from '../interfaces';
import { useNavigate } from 'react-router-dom';
import { CardBook } from '../components/products/CardBook';
import { ContainerFilter } from '../components/products/ContainerFilter';
import { useAuth } from '../hooks/useAuth';
import { fetchBooks } from '../services/bookService';

export const BookPages = () => {
  const { isAuthenticated, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState<PreparedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<PreparedBook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks();
        setBooks(data);
      } catch (err: any) {
        setError('Error al cargar los libros');
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  useEffect(() => {
    // Mostrar en consola los dos arreglos filtrados
    const librosFisicosVirtuales = books.filter(
      book => book.type === 'Físico' || book.type === 'Virtual'
    );
    const librosTesisOtros = books.filter(
      book =>
        book.type === 'Tesis' ||
        book.type === 'Servicio Comunitario' ||
        book.type === 'Pasantía' ||
        book.type === 'Pasantias'
    );
  }, [books]);

  // Generar lista dinámica de especialidades únicas a partir de los libros cargados
  const specialities = Array.from(new Set(books.map(book => book.speciality).filter(Boolean)));

  // Lista fija de especialidades para los filtros
  const specialitiesForFilter = [
    'Ingeniería De Sistemas',
    'Ingeniería Civil',
    'Ingeniería en Mantenimiento Mecánico',
    'Ingeniería Electrónica',
    'Ingeniería Industrial',
    'Ingeniería Eléctrica',
    'Arquitectura',
  ];

  // Función para normalizar textos (ignorar mayúsculas y tildes)
  function normalize(str: string) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina tildes correctamente
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Solo mostrar libros físicos o virtuales
  let filteredBooks = books.filter(
    book => book.type === 'Físico' || book.type === 'Virtual'
  );

  // Filtrar por carreras seleccionadas
  if (selectedSpecialities.length > 0) {
    filteredBooks = filteredBooks.filter(book =>
      selectedSpecialities.some(sel =>
        book.speciality && normalize(sel) === normalize(book.speciality)
      )
    );
  }

  if (loading) {
    return <p className="text-center text-gray-500 text-lg my-8">Cargando libros...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 text-lg my-8">{error}</p>;
  }

  // Handler para ver detalles
  const handleViewDetails = (book: PreparedBook) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  // Handler para descarga
  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <>
      <h1 className='text-5xl font-semibold text-center mb-12'>
        Libros
      </h1>

      {/* Banner informativo para usuarios no autenticados */}
      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Inicia sesión</strong> para poder descargar los libros. Puedes navegar y ver la información sin necesidad de registrarte.
                {!isConfigured && (
                  <span className="block mt-1 text-xs text-blue-600">
                    (Modo simulado: El sistema de autenticación no está configurado)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
        {/* FILTROS */}
        <ContainerFilter
          selectedSpecialities={selectedSpecialities}
          onChange={setSelectedSpecialities}
          specialities={specialitiesForFilter}
        />

        <div className='col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-12'>
          {filteredBooks.length === 0 ? (
            <div className="my-32">
              <p className="text-center text-gray-500 text-lg my-8">No hay libros disponibles.</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4'>
              <AnimatePresence>
                {filteredBooks.map(book => (
                  <motion.div
                    key={book.id}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                  >
                    <CardBook
                      title={book.title}
                      authors={book.authors}
                      price={book.price}
                      img={book.coverImage}
                      slug={book.slug}
                      speciality={book.speciality}
                      type={book.type}
                      onViewDetails={() => handleViewDetails(book)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* TODO: Paginación */}
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
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold mb-2 text-center">{selectedBook.title}</h3>
              <p className="text-center text-gray-700 mb-2">Autor: {selectedBook.authors}</p>
              <p className="text-lg font-semibold text-center mb-2 text-gray-800">Capítulo 1</p>
              <p className="text-gray-700 whitespace-pre-line mb-4">{(selectedBook.fragment || '').replace(/^Capítulo 1:? 0*/i, '') || 'No hay fragmento disponible.'}</p>
              {isAuthenticated ? (
                <a
                  href={selectedBook.fileUrl}
                  download
                  onClick={handleDownload}
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                >
                  Descargar libro
                </a>
              ) : (
                <p className="text-center text-red-500 font-semibold">Debes iniciar sesión para descargar el libro.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
