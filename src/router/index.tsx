import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { HomePage, BookPages, AboutPage } from '../pages';

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
				path: 'Libros',
				element: <BookPages />,
			},
			{
				path: 'nosotros',
				element: <AboutPage />,
			},
		],
	},
]);
