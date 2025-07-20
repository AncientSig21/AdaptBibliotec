type TagType = 'nuevo' | 'agotado' | 'fisico' | 'digital' | 'no disponible' | 'disponible en físico' | 'disponible digital';

interface Props {
	contentTag: TagType;
}

const getTagColor = (content: TagType) => {
	const lowerContent = content.toLowerCase();
	if (lowerContent === 'nuevo') return 'bg-blue-500';
	if (lowerContent === 'agotado') return 'bg-black';
	if (lowerContent === 'fisico' || lowerContent === 'disponible en físico') return 'bg-green-500';
	if (lowerContent === 'digital' || lowerContent === 'disponible digital') return 'bg-purple-500';
	if (lowerContent === 'no disponible') return 'bg-red-500';

	return 'bg-gray-500';
};

export const Tag = ({ contentTag }: Props) => {
	return (
		<div
			className={`text-white w-fit px-2 ${getTagColor(contentTag)}`}
		>
			<p className='uppercase text-xs font-medium'> {contentTag}</p>
		</div>
	);
};
