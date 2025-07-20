import { ReactNode } from 'react';

interface Props {
	titleSection?: string;
	children: ReactNode;
	className?: string;
}

export const SectionFormBook = ({
	titleSection,
	children,
	className = '',
}: Props) => {
	return (
		<section className={`bg-white p-6 rounded-lg border border-slate-200 ${className}`}>
			{titleSection && (
				<h3 className='font-bold text-lg mb-4 text-slate-900'>
					{titleSection}
				</h3>
			)}
			<div className='space-y-4'>{children}</div>
		</section>
	);
}; 