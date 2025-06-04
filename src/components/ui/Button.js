import React from 'react';
import { colors } from '../../constants/colors';

const Button = ({
	children,
	onClick,
	variant = 'primary',
	size = 'large',
	className = '',
	ariaLabel,
}) => {
	const baseClasses =
		'font-semibold rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300';

	const variants = {
		primary: `text-white shadow-2xl hover:shadow-3xl`,
		secondary: `border-2 shadow-lg hover:shadow-xl`,
	};

	const sizes = {
		large: 'px-10 py-5 text-xl md:text-2xl',
		medium: 'px-8 py-4 text-xl',
		small: 'px-6 py-3 text-lg',
	};

	const variantStyles =
		variant === 'primary'
			? { backgroundColor: colors.primary }
			: { borderColor: colors.primary, color: colors.primary };

	return (
		<button
			onClick={onClick}
			className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
			style={variantStyles}
			aria-label={ariaLabel}
		>
			{children}
		</button>
	);
};

export default Button;
