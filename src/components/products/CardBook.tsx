import React from 'react';

interface Props {
	img: string;
	title: string;
	author: string;
	price?: number;
	speciality: string;
	type: string;
	onViewDetails?: () => void; // Nueva prop opcional
}

export const CardBook = ({ img, title, author, speciality, type, onViewDetails }: Props) => {
	return (
		<div className='flex flex-col gap-6 relative border p-4 rounded-lg shadow-md'>
			<div className='flex relative group overflow-hidden '>
				<div className='flex h-[350px] w-full items-center justify-center py-2 lg:h-[250px]'>
					<img
						src={img}
						alt={title}
						className='object-contain h-full w-full'
					/>
				</div>

				<button
					onClick={onViewDetails}
					className='bg-white border border-slate-200 absolute w-full bottom-0 py-3 rounded-3xl flex items-center justify-center gap-1 text-sm font-medium hover:bg-stone-100 translate-y-[100%] transition-all duration-300 group-hover:translate-y-0'
				>
					+ Ver detalles
				</button>
			</div>

			<div className='flex flex-col gap-1 items-center'>
				<p className='text-[15px] font-semibold'>{title}</p>
				<p className='text-[13px] text-gray-600'>Autor: {author}</p>
				<p className='text-[13px] text-gray-600'>Especialidad: {speciality}</p>
				<p className='text-[13px] text-gray-600'>Tipo: {type}</p>
			</div>
		</div>
	);
};
