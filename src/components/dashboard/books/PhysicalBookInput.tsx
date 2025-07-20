import { Control, FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { BookFormValues } from '../../../lib/validators';

interface Props {
	control: Control<BookFormValues>;
	errors: FieldErrors<BookFormValues>;
	register: UseFormRegister<BookFormValues>;
	watch: UseFormWatch<BookFormValues>;
}

export const PhysicalBookInput = ({ control, errors, register, watch }: Props) => {
	const tipoLibro = watch('tipo_libro');
	const showPhysicalInput = tipoLibro === 'fisico' || tipoLibro === 'ambos';

	if (!showPhysicalInput) return null;

	return (
		<div className='flex flex-col gap-2'>
			<label className='text-xs font-bold tracking-tight capitalize text-slate-900'>
				Cantidad de Copias Físicas:
			</label>

			<input
				type='number'
				min='0'
				placeholder='5'
				{...register('cantidad_fisica', { valueAsNumber: true })}
				className={`border border-gray-300 py-1.5 text-sm rounded-md px-3 font-medium tracking-tighter text-slate-600 outline-none focus:outline-none ${
					errors.cantidad_fisica ? 'border-red-500' : ''
				}`}
			/>

			{errors.cantidad_fisica && (
				<p className='text-red-500 text-xs mt-1'>
					{errors.cantidad_fisica.message}
				</p>
			)}
		</div>
	);
}; 