// router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage, BookPages, TesisPages } from '../pages';
import { allBooks } from '../data/initialData';
import { TesisBook } from '../interfaces';

const onlyTesis = allBooks.filter(book => book.type === 'Tesis') as TesisBook[];

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'libros',
        element: <BookPages />,
      },
      {
        path: 'tesis',
        element: <TesisPages books={onlyTesis} />,
      },
    ],
  },
]);
