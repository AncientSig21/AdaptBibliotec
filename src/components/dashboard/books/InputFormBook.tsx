import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { BookFormValues } from '../../../lib/validators';

interface Props {
	type: string;
	placeholder?: string;
	label: string;
	name: keyof BookFormValues;
	register: UseFormRegister<BookFormValues>;
	errors: FieldErrors<BookFormValues>;
	required?: boolean;
}

export const InputFormBook = ({
	type,
	placeholder,
	label,
	name,
	register,
	errors,
	required = false,
}: Props) => {
	return (
		<div className='flex flex-col gap-2'>
			<label className='text-xs font-bold tracking-tight capitalize text-slate-900'>
				{label}:
			</label>

			<input
				type={type}
				placeholder={placeholder}
				{...register(name)}
				className={`border border-gray-300 py-1.5 text-sm rounded-md px-3 font-medium tracking-tighter text-slate-600 outline-none focus:outline-none ${
					errors[name] ? 'border-red-500' : ''
				}`}
				required={required}
			/>

			{errors[name] && (
				<p className='text-red-500 text-xs mt-1'>
					{errors[name]?.message}
				</p>
			)}
		</div>
	);
}; 