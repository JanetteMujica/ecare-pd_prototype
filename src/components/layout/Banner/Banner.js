import React from 'react';
import { ECareLogo } from '../../ui/Logo/LogoPlaceholder';
import styles from './Banner.module.css';

const Banner = ({ className = '', onLogoClick }) => {
	const handleLogoClick = () => {
		if (onLogoClick) {
			onLogoClick();
		}
	};

	return (
		<div className={`${styles.blueBanner} ${className}`}>
			<div className={styles.bannerContent}>
				<button
					className={styles.logoButton}
					onClick={handleLogoClick}
					aria-label='Go to home page'
					type='button'
				>
					<ECareLogo className={styles.logo} />
				</button>
			</div>
		</div>
	);
};

export default Banner;
