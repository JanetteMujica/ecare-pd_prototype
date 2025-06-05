import React from 'react';
import { colors } from '../../../constants/colors';
import styles from './Button.module.css';

const Button = ({
	children,
	onClick,
	variant = 'primary',
	size = 'large',
	className = '',
	ariaLabel,
	disabled = false,
	type = 'button',
	fullWidth = false,
	...props
}) => {
	const baseClasses = `${styles.button} ${styles[variant]} ${styles[size]}`;
	const fullWidthClass = fullWidth ? styles.fullWidth : '';
	const disabledClass = disabled ? styles.disabled : '';

	const combinedClasses =
		`${baseClasses} ${fullWidthClass} ${disabledClass} ${className}`.trim();

	const variantStyles =
		variant === 'primary'
			? { backgroundColor: colors.primary }
			: variant === 'secondary'
			? { borderColor: colors.primary, color: colors.primary }
			: {};

	return (
		<button
			type={type}
			onClick={onClick}
			className={combinedClasses}
			style={variantStyles}
			aria-label={ariaLabel}
			disabled={disabled}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
