import { Control, FieldErrors } from 'react-hook-form';
import { BookFormValues } from '../../../lib/validators';
import { Controller } from 'react-hook-form';

interface Props {
	control: Control<BookFormValues>;
	errors: FieldErrors<BookFormValues>;
}

export const BookTypeSelector = ({ control, errors }: Props) => {
	return (
		<div className='flex flex-col gap-2'>
			<label className='text-xs font-bold tracking-tight capitalize text-slate-900'>
				Tipo de Libro:
			</label>

			<Controller
				name='tipo_libro'
				control={control}
				render={({ field }) => (
					<div className='space-y-2'>
						<label className='flex items-center gap-2 cursor-pointer'>
							<input
								type='radio'
								value='virtual'
								checked={field.value === 'virtual'}
								onChange={(e) => field.onChange(e.target.value)}
								className='text-blue-600 focus:ring-blue-500'
							/>
							<span className='text-sm text-slate-600'>Virtual</span>
						</label>

						<label className='flex items-center gap-2 cursor-pointer'>
							<input
								type='radio'
								value='fisico'
								checked={field.value === 'fisico'}
								onChange={(e) => field.onChange(e.target.value)}
								className='text-blue-600 focus:ring-blue-500'
							/>
							<span className='text-sm text-slate-600'>Físico</span>
						</label>

						<label className='flex items-center gap-2 cursor-pointer'>
							<input
								type='radio'
								value='ambos'
								checked={field.value === 'ambos'}
								onChange={(e) => field.onChange(e.target.value)}
								className='text-blue-600 focus:ring-blue-500'
							/>
							<span className='text-sm text-slate-600'>Ambos</span>
						</label>
					</div>
				)}
			/>

			{errors.tipo_libro && (
				<p className='text-red-500 text-xs mt-1'>
					{errors.tipo_libro.message}
				</p>
			)}
		</div>
	);
}; 