import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PreparedBook } from '../interfaces';
import { allBooks } from '../data/initialData';
import { useNavigate } from 'react-router-dom';
import { CardBook } from '../components/products/CardBook';
import { ContainerFilter } from '../components/products/ContainerFilter';
import { useAuth } from '../hooks/useAuth';

interface BookPagesProps {
  books?: PreparedBook[];
}

export const BookPages = ({ books = [] }: BookPagesProps) => {
  const { isAuthenticated, isConfigured } = useAuth();
  const navigate = useNavigate();

  // Generar lista de especialidades únicas a partir de todos los libros
  const specialities = Array.from(new Set(allBooks.map(book => book.speciality)));

  // Estado para filtros de carrera
  const [selectedSpecialities, setSelectedSpecialities] = useState<string[]>([]);

  // Filtramos solo los de tipo Físico o Virtual
  let filteredBooks = books.filter(
    book => book.type === 'Físico' || book.type === 'Virtual'
  );

  // Filtrar por carreras seleccionadas
  if (selectedSpecialities.length > 0) {
    filteredBooks = filteredBooks.filter(book =>
      selectedSpecialities.includes(book.speciality)
    );
  }

  const [selectedBook, setSelectedBook] = useState<PreparedBook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    // Si está autenticado, el enlace funciona normalmente
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
          specialities={specialities}
        />

        <div className='col-span-2 lg:col-span-2 xl:col-span-4 flex flex-col gap-12'>
          <div className='grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4'>
            <AnimatePresence>
              {filteredBooks.map(book => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <CardBook
                    title={book.title}
                    author={book.author}
                    price={book.price}
                    img={book.coverImage}
                    speciality={book.speciality}
                    type={book.type}
                    onViewDetails={() => handleViewDetails(book)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

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
              <p className="text-lg font-semibold text-center mb-2 text-gray-800">Capítulo 1</p>
              <p className="text-gray-700 whitespace-pre-line mb-4">{(selectedBook.fragment || '').replace(/^Capítulo 1:?:?\s*/i, '') || 'No hay fragmento disponible.'}</p>
              
              {isAuthenticated ? (
                <a
                  href={selectedBook.fileUrl}
                  download
                  onClick={e => handleDownload(e)}
                  className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                >
                  Descargar libro
                </a>
              ) : (
                <button
                  onClick={() => {
                    handleCloseModal();
                    navigate('/login');
                  }}
                  className="block w-full bg-gray-600 text-white text-center py-2 rounded hover:bg-gray-700 transition"
                >
                  Inicia sesión para descargar
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
