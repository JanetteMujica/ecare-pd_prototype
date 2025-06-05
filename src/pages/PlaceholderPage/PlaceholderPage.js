import React from 'react';
import ecarepdLogo from '../../assets/images/eCarePD_logo.svg';
import cafyLogo from '../../assets/images/cafy_logo.svg';
import styles from './PlaceholderPage.module.css'; // FIXED: Correct import

const LogoPlaceholder = ({
	type = 'ecare',
	className = '',
	size = 'medium',
	usePlaceholder = false, // Option to use placeholder or real logo
}) => {
	const logoText = type === 'ecare' ? 'eCare-PD Logo' : 'CAFY Logo';
	const logoSrc = type === 'ecare' ? ecarepdLogo : cafyLogo;
	const shapeClass = type === 'ecare' ? styles.rectangular : styles.circular;
	const sizeClass = styles[size];

	const combinedClasses =
		`${styles.placeholder} ${shapeClass} ${sizeClass} ${className}`.trim();

	// If we want to use the real logo
	if (!usePlaceholder) {
		return (
			<div
				className={`${styles.logoContainer} ${shapeClass} ${sizeClass} ${className}`.trim()}
			>
				<img
					src={logoSrc}
					alt={logoText}
					className={`${styles.logoImage} ${shapeClass}`}
				/>
			</div>
		);
	}

	// Otherwise use placeholder (for development)
	return (
		<div className={combinedClasses}>
			<span className={styles.text}>{logoText}</span>
		</div>
	);
};

// Convenience components
export const ECareLogoPlaceholder = (props) => (
	<LogoPlaceholder type='ecare' {...props} />
);

export const CafyLogoPlaceholder = (props) => (
	<LogoPlaceholder type='cafy' {...props} />
);

// Real logo components
export const ECareLogo = (props) => (
	<LogoPlaceholder type='ecare' usePlaceholder={false} {...props} />
);

export const CafyLogo = (props) => (
	<LogoPlaceholder type='cafy' usePlaceholder={false} {...props} />
);

export default LogoPlaceholder;
