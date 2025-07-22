// router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage, BookPages, TesisPages } from '../pages';
import { allBooks } from '../data/initialData';
import { TesisBook } from '../interfaces';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import AdminLayout from '../pages/AdminDashboard';
import AdminStatsPage from '../pages/AdminStatsPage';
import AdminBooksPage from '../pages/AdminBooksPage';
import AdminReportsPage from '../pages/AdminReportsPage';

const onlyTesis = allBooks.filter(book => book.type === 'Tesis') as TesisBook[];
const onlyBooks = allBooks.filter(book => book.type === 'Físico' || book.type === 'Virtual');

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
        element: <BookPages books={onlyBooks} />,
      },
      {
        path: 'tesis',
        element: <TesisPages books={onlyTesis} />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminStatsPage />,
          },
          {
            path: 'libros',
            element: <AdminBooksPage />,
          },
          {
            path: 'reportes',
            element: <AdminReportsPage />,
          },
        ],
      },
      {
        path: 'estudiantes',
        element: <HomePage />,
      },
    ],
  },
]);
