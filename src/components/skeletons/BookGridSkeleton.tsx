interface Props {
	numberOfBooks: number;
}

export const BookGridSkeleton = ({ numberOfBooks }: Props) => {
	return (
		<div className='my-32'>
			<div className='h-12 bg-gray-200 rounded-lg mb-8 animate-pulse'></div>
			
			<div className='grid grid-cols-1 gap-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4'>
				{Array.from({ length: numberOfBooks }).map((_, index) => (
					<div key={index} className='flex flex-col gap-6'>
						<div className='h-[350px] lg:h-[250px] bg-gray-200 rounded-lg animate-pulse'></div>
						
						<div className='flex flex-col gap-2 items-center text-center'>
							<div className='h-4 bg-gray-200 rounded w-3/4 animate-pulse'></div>
							<div className='h-3 bg-gray-200 rounded w-1/2 animate-pulse'></div>
							<div className='flex gap-2'>
								<div className='h-6 bg-gray-200 rounded w-16 animate-pulse'></div>
								<div className='h-6 bg-gray-200 rounded w-16 animate-pulse'></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}; 