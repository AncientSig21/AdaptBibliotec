import {
	FaBoxOpen,
	FaCartShopping,
	FaFacebookF,
	FaInstagram,
	FaTiktok,
	FaXTwitter,
	FaBook,
} from 'react-icons/fa6';

export const navbarLinks = [
	{
		id: 1,
		title: 'Inicio',
		href: '/',
	},
	{
		id: 2,
		title: 'Biblioteca',
		href: '/libros',
	},
	{
		id: 3,
		title: 'Celulares',
		href: '/celulares',
	},
	{
		id: 4,
		title: 'Sobre Nosotros',
		href: '/nosotros',
	},
];

export const socialLinks = [
	{
		id: 1,
		title: 'Facebook',
		href: 'https://www.facebook.com',
		icon: <FaFacebookF />,
	},
	{
		id: 2,
		title: 'Twitter',
		href: 'https://www.twitter.com',
		icon: <FaXTwitter />,
	},
	{
		id: 3,
		title: 'Instagram',
		href: 'https://www.instagram.com',
		icon: <FaInstagram />,
	},
	{
		id: 4,
		title: 'Tiktok',
		href: 'https://www.tiktok.com',
		icon: <FaTiktok />,
	},
];

export const dashboardLinks = [
	{
		id: 1,
		title: 'Libros',
		href: '/dashboard/libros',
		icon: <FaBook size={25} />,
	},
	{
		id: 2,
		title: 'Productos',
		href: '/dashboard/productos',
		icon: <FaBoxOpen size={25} />,
	},
	{
		id: 3,
		title: 'Ordenes',
		href: '/dashboard/ordenes',
		icon: <FaCartShopping size={25} />,
	},
];
