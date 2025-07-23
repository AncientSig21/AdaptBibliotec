import React from 'react';
import { useState } from 'react';

interface Props {
	img: string;
	title: string;
	authors: string;
	price?: number;
	slug: string;
	speciality: string;
	type: string;
	fragment?: string;
	fileUrl?: string;
	onViewDetails?: () => void; // Visualizar PDF
	onShowDetails?: () => void; // Ver detalles
}

export const CardBook = ({ img, title, authors, slug, speciality, type, fragment, fileUrl, onViewDetails, onShowDetails }: Props) => {
	const [showNoPdf, setShowNoPdf] = useState(false);
	let hideTimeout: NodeJS.Timeout;

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
			</div>

			<div className='flex flex-col gap-1 items-center'>
				<p className='text-[15px] font-semibold'>{title}</p>
				<p className='text-[13px] text-gray-600'>Especialidad: {speciality}</p>
				<p className='text-[13px] text-gray-600'>Tipo: {type}</p>
				{fragment && <p className='text-[12px] text-gray-400 truncate w-full' title={fragment}>Fragmento: {fragment.slice(0, 30)}...</p>}

				<div className='flex gap-2 mt-2 relative'>
					{/* Botón Visualizar */}
					<button
						onClick={() => {
							if (fileUrl && onViewDetails) {
								onViewDetails();
							} else {
								setShowNoPdf(true);
								clearTimeout(hideTimeout);
								hideTimeout = setTimeout(() => setShowNoPdf(false), 2000);
							}
						}}
						className={`px-3 py-1 rounded text-xs font-medium transition bg-green-600 text-white hover:bg-green-700`}
					>
						Visualizar
					</button>
					{showNoPdf && (
						<div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs rounded px-3 py-2 shadow z-20 animate-fade-in">
							Este libro no cuenta con un PDF para visualizar.
							<span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-gray-800 rotate-45"></span>
						</div>
					)}
					{/* Botón Reservar solo si es físico */}
					{type === 'Físico' && (
						<button
							className='bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-xs font-medium'
						>
							Reservar
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
