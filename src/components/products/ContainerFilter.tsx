import { Separator } from '../shared/Separator';

interface Props {
	selectedSpecialities: string[];
	onChange: (specialities: string[]) => void;
	specialities: string[]; // Lista de especialidades únicas
}

export const ContainerFilter = ({ selectedSpecialities, onChange, specialities }: Props) => {
	const handleCheckbox = (brand: string) => {
		if (selectedSpecialities.includes(brand)) {
			onChange(selectedSpecialities.filter(s => s !== brand));
		} else {
			onChange([...selectedSpecialities, brand]);
		}
	};

	return (
		<div className='p-5 border border-slate-200 rounded-lg h-fit col-span-2 lg:col-span-1'>
			<h3 className='font-semibold text-xl mb-4'>Filtros</h3>

			{/* Separador  */}
			<Separator />

			<div className='flex flex-col gap-3'>
				<h3 className='text-lg font-medium text-black'>Carreras</h3>

				<div className='flex flex-col gap-2'>
					{specialities.map(brand => (
						<label key={brand} className='inline-flex items-center'>
							<input
								type='checkbox'
								className='text-black border-black focus:ring-black accent-black'
								checked={selectedSpecialities.includes(brand)}
								onChange={() => handleCheckbox(brand)}
							/>
							<span className='ml-2 text-black text-sm cursor-pointer'>
								{brand}
							</span>
						</label>
					))}
				</div>
			</div>
		</div>
	);
};
