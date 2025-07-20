import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	BookFormValues,
	bookSchema,
} from '../../../lib/validators';
import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import {
	useCreateBook,
	useBook,
	useUpdateBook,
} from '../../../hooks';
import { Loader } from '../../shared/Loader';

interface Props {
	titleForm: string;
}

export const FormBook = ({ titleForm }: Props) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		control,
	} = useForm<BookFormValues>({
		resolver: zodResolver(bookSchema),
	});

	const { id } = useParams<{ id: string }>();

	const { data: book, isLoading } = useBook(id || '');
	const { mutate: createBook, isPending } = useCreateBook();
	const { mutate: updateBook, isPending: isUpdatePending } =
		useUpdateBook(book?.id_libro || '');

	const navigate = useNavigate();

	useEffect(() => {
		if (book && !isLoading) {
			setValue('titulo', book.titulo);
			setValue('fecha_publicacion', book.fecha_publicacion);
			setValue('sinopsis', book.sinopsis);
			setValue('url_portada', book.url_portada || '');
			setValue('autores', book.autores.map(a => a.id));
			setValue('tipo_libro', book.libro_virtual && book.libro_fisico ? 'ambos' : 
				book.libro_virtual ? 'virtual' : 'fisico');
			setValue('direccion_virtual', book.libro_virtual?.direccion_del_libro);
			setValue('cantidad_fisica', book.libro_fisico?.cantidad);
		}
	}, [book, isLoading, setValue]);

	const onSubmit = handleSubmit(data => {
		if (id) {
			updateBook({
				titulo: data.titulo,
				fecha_publicacion: data.fecha_publicacion,
				sinopsis: data.sinopsis,
				url_portada: data.url_portada,
				autores: data.autores,
				tipo_libro: data.tipo_libro,
				direccion_virtual: data.direccion_virtual,
				cantidad_fisica: data.cantidad_fisica,
			});
		} else {
			createBook({
				titulo: data.titulo,
				fecha_publicacion: data.fecha_publicacion,
				sinopsis: data.sinopsis,
				url_portada: data.url_portada,
				autores: data.autores,
				tipo_libro: data.tipo_libro,
				direccion_virtual: data.direccion_virtual,
				cantidad_fisica: data.cantidad_fisica,
			});
		}
	});

	if (isPending || isUpdatePending || isLoading) return <Loader />;

	return (
		<div className='flex flex-col gap-6 relative'>
			<div className='flex justify-between items-center'>
				<div className='flex items-center gap-3'>
					<button
						className='bg-white p-1.5 rounded-md shadow-sm border border-slate-200 transition-all group hover:scale-105'
						onClick={() => navigate(-1)}
					>
						<IoIosArrowBack
							size={18}
							className='transition-all group-hover:scale-125'
						/>
					</button>
					<h2 className='font-bold tracking-tight text-2xl capitalize'>
						{titleForm}
					</h2>
				</div>
			</div>

			<form
				className='grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-max flex-1'
				onSubmit={onSubmit}
			>
				<section className='bg-white p-6 rounded-lg border border-slate-200 lg:col-span-2 lg:row-span-2'>
					<h3 className='font-bold text-lg mb-4 text-slate-900'>
						Detalles del Libro
					</h3>
					<div className='space-y-4'>
						<div className='flex flex-col gap-2'>
							<label className='text-xs font-bold tracking-tight capitalize text-slate-900'>
								Título:
							</label>
							<input
								type='text'
								placeholder='Ejemplo: El Señor de los Anillos'
								{...register('titulo')}
								className={`border border-gray-300 py-1.5 text-sm rounded-md px-3 font-medium tracking-tighter text-slate-600 outline-none focus:outline-none ${
									errors.titulo ? 'border-red-500' : ''
								}`}
								required
							/>
							{errors.titulo && (
								<p className='text-red-500 text-xs mt-1'>
									{errors.titulo.message}
								</p>
							)}
						</div>

						<div className='flex flex-col gap-2'>
							<label className='text-xs font-bold tracking-tight capitalize text-slate-900'>
								Fecha de publicación:
							</label>
							<input
								type='date'
								{...register('fecha_publicacion')}
								className={`border border-gray-300 py-1.5 text-sm rounded-md px-3 font-medium tracking-tighter text-slate-600 outline-none focus:outline-none ${
									errors.fecha_publicacion ? 'border-red-500' : ''
								}`}
								required
							/>
							{errors.fecha_publicacion && (
								<p className='text-red-500 text-xs mt-1'>
									{errors.fecha_publicacion.message}
								</p>
							)}
						</div>

						<div className='flex flex-col gap-2'>
							<label className='text-xs font-bold tracking-tight capitalize text-slate-900'>
								Sinopsis:
							</label>
							<textarea
								placeholder='Escribe la sinopsis del libro...'
								{...register('sinopsis')}
								className={`w-full border border-gray-300 py-2 px-3 text-sm rounded-md font-medium tracking-tighter text-slate-600 outline-none focus:outline-none min-h-[100px] ${
									errors.sinopsis ? 'border-red-500' : ''
								}`}
							/>
							{errors.sinopsis && (
								<p className='text-red-500 text-xs mt-1'>
									{errors.sinopsis.message}
								</p>
							)}
						</div>

						<div className='flex flex-col gap-2'>
							<label className='text-xs font-bold tracking-tight capitalize text-slate-900'>
								URL de la Portada:
							</label>
							<input
								type='url'
								placeholder='https://ejemplo.com/portada.jpg'
								{...register('url_portada')}
								className={`border border-gray-300 py-1.5 text-sm rounded-md px-3 font-medium tracking-tighter text-slate-600 outline-none focus:outline-none ${
									errors.url_portada ? 'border-red-500' : ''
								}`}
							/>
							{errors.url_portada && (
								<p className='text-red-500 text-xs mt-1'>
									{errors.url_portada.message}
								</p>
							)}
						</div>
					</div>
				</section>

				<section className='bg-white p-6 rounded-lg border border-slate-200'>
					<h3 className='font-bold text-lg mb-4 text-slate-900'>
						Tipo de Libro
					</h3>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<label className='flex items-center gap-2 cursor-pointer'>
								<input
									type='radio'
									value='virtual'
									{...register('tipo_libro')}
									className='text-blue-600 focus:ring-blue-500'
								/>
								<span className='text-sm text-slate-600'>Virtual</span>
							</label>

							<label className='flex items-center gap-2 cursor-pointer'>
								<input
									type='radio'
									value='fisico'
									{...register('tipo_libro')}
									className='text-blue-600 focus:ring-blue-500'
								/>
								<span className='text-sm text-slate-600'>Físico</span>
							</label>

							<label className='flex items-center gap-2 cursor-pointer'>
								<input
									type='radio'
									value='ambos'
									{...register('tipo_libro')}
									className='text-blue-600 focus:ring-blue-500'
								/>
								<span className='text-sm text-slate-600'>Ambos</span>
							</label>
						</div>

						{errors.tipo_libro && (
							<p className='text-red-500 text-xs mt-1'>
								{errors.tipo_libro.message}
							</p>
						)}
					</div>
				</section>

				<div className='col-span-full flex justify-end gap-3'>
					<button
						type='button'
						onClick={() => navigate(-1)}
						className='px-6 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50'
					>
						Cancelar
					</button>
					<button
						type='submit'
						className='px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
					>
						{id ? 'Actualizar' : 'Crear'} Libro
					</button>
				</div>
			</form>
		</div>
	);
}; 