import { TesisBook } from '../interfaces';
import { CardBook } from '../components/products/CardBook';

interface Props {
  books?: TesisBook[];
}

export const TesisPages = ({ books = [] }: Props) => {
  return (
    <div className="my-32">
      <h2 className="text-3xl font-semibold text-center mb-8 md:text-4xl lg:text-5xl">
        Libros Tipo Tesis
      </h2>

      <div className="grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {books.map(book => (
          <CardBook
            key={book.id}
            title={book.title}
            author={book.author}
            price={book.price ?? 0}
            img={book.coverImage}
            slug={book.slug}
            speciality={book.speciality}
            type={book.type}
          />
        ))}
      </div>
    </div>
  );
};
