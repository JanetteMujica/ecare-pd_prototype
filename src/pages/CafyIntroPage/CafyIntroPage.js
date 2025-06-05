import React from 'react';
import Button from '../../components/ui/Button';
import { CafyLogoPlaceholder, ECareLogo } from '../../components/ui/Logo';
import { appContent } from '../../constants/features';
import { colors } from '../../constants/colors';
import styles from './CafyIntroPage.module.css';

const CafyIntroPage = ({ onStartGoals }) => {
	const { cafy } = appContent;

	return (
		<div className={styles.container}>
			{/* FIXED: eCare-PD logo in banner (consistent with WelcomePage) */}
			<div className={styles.blueBanner}>
				<div className={styles.bannerContent}>
					<ECareLogo size='medium' className={styles.bannerLogo} />
				</div>
			</div>

			{/* Main content */}
			<div className={styles.content}>
				{/* FIXED: CAFY Logo above text content (not in banner) */}
				<CafyLogoPlaceholder size='large' className={styles.cafyLogo} />

				{/* Content */}
				<div className={styles.textContent}>
					<h2 className={styles.heading} style={{ color: colors.primaryDark }}>
						{cafy.greeting}
					</h2>

					<p
						className={styles.description}
						style={{ color: colors.primaryDark }}
					>
						{cafy.description}
					</p>

					<Button
						onClick={onStartGoals}
						size='medium'
						ariaLabel='Start setting goals with CAFY'
					>
						{cafy.cta}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CafyIntroPage;
