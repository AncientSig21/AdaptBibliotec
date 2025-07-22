import { NavLink, useNavigate } from 'react-router-dom';
import { navbarLinks } from '../../constants/links';
import {
	HiOutlineSearch,
	HiOutlineShoppingBag,
} from 'react-icons/hi';
import { FaBarsStaggered } from 'react-icons/fa6';
import { FaTachometerAlt } from 'react-icons/fa';
import { Logo } from './Logo';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
	const { user, isAuthenticated, logout, isConfigured, loading } = useAuth();
	const navigate = useNavigate();
	const [showMenu, setShowMenu] = useState(false);
	const [showDownloads, setShowDownloads] = useState(false);
	const [downloads, setDownloads] = useState<{ id: string; title: string }[]>([]);
	const userMenuRef = useRef<HTMLDivElement>(null);
	const downloadsMenuRef = useRef<HTMLDivElement>(null);

	// Cargar historial de descargas desde localStorage
	useEffect(() => {
		if (user) {
			const saved = localStorage.getItem(`downloads_${user.id}`);
			if (saved) {
				setDownloads(JSON.parse(saved));
			}
		}
	}, [user?.id]);

	useEffect(() => {
		if (!showMenu) return;
		function handleClickOutside(event: MouseEvent) {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setShowMenu(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showMenu]);

	useEffect(() => {
		if (!showDownloads) return;
		function handleClickOutsideDownloads(event: MouseEvent) {
			if (downloadsMenuRef.current && !downloadsMenuRef.current.contains(event.target as Node)) {
				setShowDownloads(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutsideDownloads);
		return () => document.removeEventListener('mousedown', handleClickOutsideDownloads);
	}, [showDownloads]);

	const handleToggleMenu = () => {
		setShowMenu(v => {
			if (!v) setShowDownloads(false);
			return !v;
		});
	};

	const handleToggleDownloads = () => {
		setShowDownloads(v => {
			if (!v) setShowMenu(false);
			return !v;
		});
	};

	const handleLogout = () => {
		logout();
		navigate('/');
		setShowMenu(false);
	};

	const handleLogin = () => {
		navigate('/login');
	};

	// Si está cargando, mostrar navbar básico
	if (loading) {
		return (
			<header className='bg-white text-black py-4 flex items-center justify-between px-5 border-b border-slate-200 lg:px-12'>
				<Logo />
				<nav className='space-x-5 hidden md:flex'>
					{navbarLinks.map(link => (
						<NavLink
							key={link.id}
							to={link.href}
							className={({ isActive }) =>
								`${
									isActive ? 'text-cyan-600 underline' : ''
								} transition-all duration-300 font-medium hover:text-cyan-600 hover:underline `
							}
						>
							{link.title}
						</NavLink>
					))}
				</nav>
				<div className='flex gap-5 items-center'>
					<button>
						<HiOutlineSearch size={25} />
					</button>
					<div className='animate-pulse bg-gray-200 w-9 h-9 rounded-full'></div>
				</div>
			</header>
		);
	}

	return (
		<header className='bg-white text-black py-4 flex items-center justify-between px-5 border-b border-slate-200 lg:px-12'>
			<Logo />

			<nav className='space-x-5 hidden md:flex'>
				{navbarLinks.map(link => (
					<NavLink
						key={link.id}
						to={link.href}
						className={({ isActive }) =>
							`${
								isActive ? 'text-cyan-600 underline' : ''
							} transition-all duration-300 font-medium hover:text-cyan-600 hover:underline `
						}
					>
						{link.title}
					</NavLink>
				))}
			</nav>

			<div className='flex gap-5 items-center'>
				<button>
					<HiOutlineSearch size={25} />
				</button>

				{isConfigured && isAuthenticated && user ? (
					<>
						{/* Botón para admin: Ir al dashboard */}
						{user.rol === 'admin' && (
							<button
								title="Ir al Dashboard"
								onClick={() => navigate('/admin')}
								className="p-2 rounded-full hover:bg-gray-100 transition"
							>
								<FaTachometerAlt size={22} className="text-blue-600" />
							</button>
						)}
						<div className='relative'>
							{/* User Nav */}
							<button
								onClick={handleToggleMenu}
								className='border-2 border-slate-700 w-9 h-9 rounded-full grid place-items-center text-lg font-bold focus:outline-none'
							>
								{user.nombre.charAt(0).toUpperCase()}
							</button>
							{showMenu && (
								<div ref={userMenuRef} className='absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded shadow-lg p-4 z-50'>
									<p className='font-semibold mb-1'>Nombre: <span className='font-normal'>{user.nombre}</span></p>
									<p className='font-semibold mb-1'>Email: <span className='font-normal'>{user.correo}</span></p>
									{user.escuela && (
										<p className='font-semibold mb-3'>Escuela: <span className='font-normal'>{user.escuela}</span></p>
									)}
									<button
										onClick={handleLogout}
										className='w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition text-sm'
									>
										Cerrar sesión
									</button>
								</div>
							)}
						</div>

						<div className='relative'>
							<button className='relative' onClick={handleToggleDownloads}>
								<span className='absolute -bottom-2 -right-2 w-5 h-5 grid place-items-center bg-black text-white text-xs rounded-full'>
									{downloads.length}
								</span>
								<HiOutlineShoppingBag size={25} />
							</button>
							{showDownloads && (
								<div ref={downloadsMenuRef} className='absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded shadow-lg p-4 z-50'>
									<p className='font-semibold mb-2'>Historial de descargas</p>
									{downloads.length === 0 ? (
										<p className='text-gray-500 text-sm'>No has descargado ningún libro.</p>
									) : (
										<ul className='max-h-48 overflow-y-auto'>
											{downloads.map(d => (
												<li key={d.id} className='text-sm py-1 border-b last:border-b-0'>{d.title}</li>
											))}
										</ul>
									)}
								</div>
							)}
						</div>
					</>
				) : (
					<button
						onClick={handleLogin}
						className='bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition'
					>
						Iniciar sesión
					</button>
				)}
			</div>

			<button className='md:hidden' onClick={() => setShowMenu(v => !v)}>
				<FaBarsStaggered size={25} />
			</button>

			{/* Menú desplegable mobile */}
			{showMenu && (
				<div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-end md:hidden">
					<div className="w-2/3 max-w-xs bg-white h-full shadow-lg p-6 flex flex-col gap-6 animate-slide-in">
						<button onClick={() => setShowMenu(false)} className="self-end text-2xl text-gray-500 mb-4">&times;</button>
						<NavLink to="/" onClick={() => setShowMenu(false)} className={({ isActive }) => `${isActive ? 'text-cyan-600 underline' : ''} text-lg font-semibold`}>Inicio</NavLink>
						<NavLink to="/libros" onClick={() => setShowMenu(false)} className={({ isActive }) => `${isActive ? 'text-cyan-600 underline' : ''} text-lg font-semibold`}>Libros</NavLink>
						<NavLink to="/tesis" onClick={() => setShowMenu(false)} className={({ isActive }) => `${isActive ? 'text-cyan-600 underline' : ''} text-lg font-semibold`}>Proyectos de Investigación</NavLink>
					</div>
				</div>
			)}
		</header>
	);
};
