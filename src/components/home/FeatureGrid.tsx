import { BiWorld } from 'react-icons/bi';
import { FaBook, FaLaptop } from 'react-icons/fa6';
import { HiMiniReceiptRefund } from 'react-icons/hi2';
import { MdLocalShipping } from 'react-icons/md';

export const FeatureGrid = () => {
	return (
		<div className='grid grid-cols-2 gap-8 mt-6 mb-16 lg:grid-cols-4 lg:gap-5'>
			<div className='flex items-center gap-6'>
				<FaBook size={40} className='text-slate-600' />

				<div className='space-y-1'>
					<p className='font-semibold'>Libros Físicos</p>
					<p className='text-sm'>Reserva ejemplares físicos</p>
				</div>
			</div>

			<div className='flex items-center gap-6'>
				<FaLaptop size={40} className='text-slate-600' />

				<div className='space-y-1'>
					<p className='font-semibold'>Libros Digitales</p>
					<p className='text-sm'>
						Lee en línea desde cualquier dispositivo
					</p>
				</div>
			</div>

			<div className='flex items-center gap-6'>
				<HiMiniReceiptRefund size={40} className='text-slate-600' />

				<div className='space-y-1'>
					<p className='font-semibold'>Préstamo Gratuito</p>
					<p className='text-sm'>
						Acceso gratuito a toda nuestra biblioteca
					</p>
				</div>
			</div>

			<div className='flex items-center gap-6'>
				<BiWorld size={40} className='text-slate-600' />

				<div className='space-y-1'>
					<p className='font-semibold'>Acceso 24/7</p>
					<p className='text-sm'>
						Biblioteca disponible en cualquier momento
					</p>
				</div>
			</div>
		</div>
	);
};
