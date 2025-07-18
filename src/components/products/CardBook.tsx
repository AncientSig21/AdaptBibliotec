import { Link } from 'react-router-dom';


interface Props {
	img: string;
	title: string;
	author: string;
	price?: number;
	slug: string;
	speciality: string;
	type:string;
}

export const CardBook = ({ img, title, author, slug, speciality, type }: Props) => {
	return (
		<div className='flex flex-col gap-6 relative border p-4 rounded-lg shadow-md'>
			<Link
				to={`/libros/${slug}`}
				className='flex relative group overflow-hidden '
			>
				<div className='flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]'>
					<img
						src={img}
						alt={title}
						className='object-contain h-full w-full'
					/>
				</div>

				<button className='bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'>
					+ Ver detalles
				</button>
			</Link>

			<div className='flex flex-col gap-1 items-center'>
				<p className='text-[15px] font-semibold'>{title}</p>
				<p className='text-[13px] text-gray-600'>Autor: {author}</p>
				<p className='text-[13px] text-gray-600'>Especialidad: {speciality}</p>
				<p className='text-[13px] text-gray-600'>Tipo: {type}</p>
			</div>
		</div>
	);
};
