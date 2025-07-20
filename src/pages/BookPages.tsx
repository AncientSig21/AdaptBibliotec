import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PreparedBook } from '../interfaces';
import { allBooks } from '../data/initialData';
import { useNavigate } from 'react-router-dom';
import { CardBook } from '../components/products/CardBook';
import { ContainerFilter } from '../components/products/ContainerFilter';

interface BookPagesProps {
  books?: PreparedBook[];
}

export const BookPages = ({ books = [] }: BookPagesProps) => {
  // Simulación de autenticación (cambiar por lógica real después)
  const isAuthenticated = false; // Cambia a true para simular usuario logueado
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
              <a
                href={selectedBook.fileUrl}
                download
                onClick={e => handleDownload(e)}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
              >
                Descargar libro
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
