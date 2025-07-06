import React from 'react';
import { colors, createColoredShadow } from '../../../constants/colors';
import styles from './FeatureCard.module.css';

const FeatureCard = ({
	feature,
	className = '',
	vertical = false,
	onClick,
	interactive = false,
}) => {
	const cardClasses = vertical
		? `${styles.card} ${styles.vertical}`
		: `${styles.card} ${styles.horizontal}`;

	const interactiveClass = interactive ? styles.interactive : '';
	const combinedClasses =
		`${cardClasses} ${interactiveClass} ${className}`.trim();

	const cardStyles = {
		borderColor: feature.color,
		boxShadow: createColoredShadow
			? createColoredShadow(feature.color, 0.2)
			: `0 8px 25px -5px ${feature.color}30, 0 10px 10px -5px ${feature.color}20`,
	};

	const iconStyles = {
		backgroundColor: feature.color,
	};

	const numberStyles = {
		color: feature.color,
	};

	const titleStyles = {
		color: colors.text?.primary || colors.primaryDark,
		fontWeight: 900,
	};

	const descStyles = {
		color: colors.text?.primary || colors.primaryDark,
	};

	const handleClick = () => {
		if (onClick) {
			onClick(feature);
		}
	};

	const handleKeyDown = (e) => {
		if ((e.key === 'Enter' || e.key === ' ') && onClick) {
			e.preventDefault();
			onClick(feature);
		}
	};

	const CardContent = () => (
		<>
			{vertical ? (
				<>
					<div className={styles.iconContainer} style={iconStyles}>
						<feature.icon size={24} color='white' />
					</div>
					<div className={styles.contentContainer}>
						<div className={styles.headerContainer}>
							<span className={styles.number} style={numberStyles}>
								{feature.number}
							</span>
							<div className={styles.textContainer}>
								<h2 className={styles.title} style={titleStyles}>
									{feature.title}
								</h2>
								<p className={styles.description} style={descStyles}>
									{feature.desc}
								</p>
							</div>
						</div>
					</div>
				</>
			) : (
				<>
					<h3 className={styles.title} style={titleStyles}>
						{feature.title}
					</h3>
					<p className={styles.description} style={descStyles}>
						{feature.desc}
					</p>
				</>
			)}
		</>
	);

	if (interactive && onClick) {
		return (
			<button
				className={combinedClasses}
				style={cardStyles}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				aria-label={`${feature.title}: ${feature.desc}`}
			>
				<CardContent />
			</button>
		);
	}

	return (
		<div className={combinedClasses} style={cardStyles}>
			<CardContent />
		</div>
	);
};

export default FeatureCard;
