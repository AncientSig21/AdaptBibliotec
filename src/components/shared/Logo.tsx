import { Link } from 'react-router-dom';

export const Logo = () => {
	return (
		<Link
			to='/'
			className={`text-2xl font-bold tracking-tighter transition-all`}
		>
			<p className='hidden lg:block'>
				Biblioteca
				<span className='text-orange-400'>Virtual</span>
			</p>

			<p className='flex text-4xl lg:hidden'>
				<span className='-skew-x-6'>B</span>
				<span className='text-cyan-600 skew-x-6'>V</span>
			</p>
		</Link>
	);
};
