import { TesisBook } from '../interfaces';
import { CardBook } from '../components/products/CardBook';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  books?: TesisBook[];
}

export const TesisPages = ({ books = [] }: Props) => {
  const [selectedBook, setSelectedBook] = useState<TesisBook | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (book: TesisBook) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  return (
    <div className="my-32">
      <h2 className="text-3xl font-semibold text-center mb-8 md:text-4xl lg:text-5xl">
        Tesis
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="col-span-2 lg:col-span-3 xl:col-span-5 flex flex-col gap-12">
          <div className="grid grid-cols-2 gap-3 gap-y-10 xl:grid-cols-4">
            {books.map(book => (
              <CardBook
                key={book.id}
                title={book.title}
                author={book.author}
                price={book.price}
                img={book.coverImage}
                slug={book.slug}
                speciality={book.speciality}
                type={book.type}
                fragment={book.fragment}
                fileUrl={book.fileUrl}
                onViewDetails={() => handleViewDetails(book)}
              />
            ))}
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
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                  >
                    Descargar libro
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
