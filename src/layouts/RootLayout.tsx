import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';
import { Banner } from '../components/home/Banner';
import { useAuth } from '../hooks/useAuth';
import MorosoBlock from '../components/shared/MorosoBlock';

export const RootLayout = () => {
	const { pathname } = useLocation();
	const { user, isUserMoroso, loading } = useAuth();

	// Si el usuario está cargando, mostrar loading
	if (loading) {
		return (
			<div className="min-h-screen bg-gray-100 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
					<p className="mt-4 text-gray-600">Cargando...</p>
				</div>
			</div>
		);
	}

	// Si el usuario está autenticado y es moroso, mostrar bloqueo
	if (user && isUserMoroso()) {
		return <MorosoBlock user={user} />;
	}

	return (
		<div className='h-screen flex flex-col font-montserrat'>
			<Navbar />

			{pathname === '/' && <Banner />}

			<main className='container my-8 flex-1'>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};
