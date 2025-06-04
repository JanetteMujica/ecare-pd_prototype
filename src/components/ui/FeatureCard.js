import React from 'react';
import { colors } from '../../constants/colors';

const FeatureCard = ({ feature, className = '', vertical = false }) => {
	const cardClasses = vertical
		? 'flex items-start space-x-4 p-6 rounded-2xl bg-white shadow-lg border-3'
		: 'text-center p-4 rounded-xl bg-white shadow-lg border-3';

	return (
		<div
			className={`${cardClasses} ${className}`}
			style={{
				borderColor: feature.color,
				boxShadow: `0 8px 25px -5px ${feature.color}30, 0 10px 10px -5px ${feature.color}20`,
			}}
		>
			{/* Component content... */}
		</div>
	);
};

export default FeatureCard;
