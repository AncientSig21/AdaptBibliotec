import { Control, FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { BookFormValues } from '../../../lib/validators';

interface Props {
	control: Control<BookFormValues>;
	errors: FieldErrors<BookFormValues>;
	register: UseFormRegister<BookFormValues>;
	watch: UseFormWatch<BookFormValues>;
}

export const VirtualBookInput = ({ control, errors, register, watch }: Props) => {
	const tipoLibro = watch('tipo_libro');
	const showVirtualInput = tipoLibro === 'virtual' || tipoLibro === 'ambos';

	if (!showVirtualInput) return null;

	return (
		<div className='flex flex-col gap-2'>
			<label className='text-xs font-bold tracking-tight capitalize text-slate-900'>
				Dirección del Libro Virtual:
			</label>

			<input
				type='url'
				placeholder='https://ejemplo.com/libro.pdf'
				{...register('direccion_virtual')}
				className={`border border-gray-300 py-1.5 text-sm rounded-md px-3 font-medium tracking-tighter text-slate-600 outline-none focus:outline-none ${
					errors.direccion_virtual ? 'border-red-500' : ''
				}`}
			/>

			{errors.direccion_virtual && (
				<p className='text-red-500 text-xs mt-1'>
					{errors.direccion_virtual.message}
				</p>
			)}
		</div>
	);
}; 