import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import { CafyLogoPlaceholder, ECareLogo } from '../../components/ui/Logo';
import { appContent } from '../../constants/features';
import { colors } from '../../constants/colors';
import styles from './CafyIntroPage.module.css';

const CafyIntroPage = ({ onStartGoals, onCancel }) => {
	const { cafy } = appContent;

	return (
		<div className={styles.container}>
			<div className={styles.blueBanner}>
				<div className={styles.bannerContent}>
					<ECareLogo size='medium' className={styles.bannerLogo} />
					{onCancel && (
						<button
							onClick={onCancel}
							className={styles.backButton}
							aria-label='Go back to welcome page'
						>
							<ArrowLeft size={16} />
							Back
						</button>
					)}
				</div>
			</div>

			<div className={styles.content}>
				<CafyLogoPlaceholder size='large' className={styles.cafyLogo} />

				<div className={styles.textContent}>
					<h2
						className={styles.heading}
						style={{ color: colors.primaryDark, fontWeight: 900 }}
					>
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
						size='large'
						variant='primary'
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
