import { Control, FieldErrors, useFieldArray } from 'react-hook-form';
import { BookFormValues } from '../../../lib/validators';
import { useState } from 'react';
import { useAuthors } from '../../../hooks';

interface Props {
	control: Control<BookFormValues>;
	errors: FieldErrors<BookFormValues>;
}

export const AuthorsInput = ({ control, errors }: Props) => {
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'autores',
	});

	const { data: authors = [] } = useAuthors();
	const [selectedAuthor, setSelectedAuthor] = useState('');

	const handleAddAuthor = () => {
		if (selectedAuthor && !fields.find(field => field === selectedAuthor)) {
			append(selectedAuthor);
			setSelectedAuthor('');
		}
	};

	const handleRemoveAuthor = (index: number) => {
		remove(index);
	};

	return (
		<div className='flex flex-col gap-2'>
			<label className='text-xs font-bold tracking-tight capitalize text-slate-900'>
				Autores:
			</label>

			<ul className='space-y-3 pl-5'>
				{fields.map((field, index) => (
					<li
						key={field}
						className='flex items-center justify-between gap-2'
					>
						<div className='flex items-center gap-2'>
							<div className='bg-slate-500 h-2 w-2 rounded-full' />
							<span className='text-sm text-slate-600 font-medium'>
								{field}
							</span>
						</div>

						<button
							type='button'
							onClick={() => handleRemoveAuthor(index)}
							className='text-sm text-red-500 font-bold pr-2 hover:scale-110'
						>
							X
						</button>
					</li>
				))}
			</ul>

			<div className='flex gap-2'>
				<select
					value={selectedAuthor}
					onChange={(e) => setSelectedAuthor(e.target.value)}
					className='flex-1 border border-gray-300 py-1.5 text-sm rounded-md px-3 font-medium tracking-tighter text-slate-600 outline-none focus:outline-none'
				>
					<option value=''>Seleccionar autor</option>
					{authors.map((author) => (
						<option key={author.id} value={author.id}>
							{author.nombre}
						</option>
					))}
				</select>

				<button
					type='button'
					onClick={handleAddAuthor}
					className='px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
				>
					Agregar
				</button>
			</div>

			{errors.autores && (
				<p className='text-red-500 text-xs mt-1'>
					{errors.autores.message}
				</p>
			)}
		</div>
	);
}; 