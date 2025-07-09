import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { ECareLogo } from '../../components/ui/Logo/LogoPlaceholder';
import CircularProcess from '../../components/features/CircularProcess';
import { appContent } from '../../constants/features';
import { colors } from '../../constants/colors';
import styles from './WelcomePage.module.css';

const WelcomePage = ({ onGetStarted, onFeatureClick }) => {
	const { welcome } = appContent;

	return (
		<div className={styles.container}>
			{/* FIXED: Consistent blue banner with eCare-PD logo */}
			<div className={styles.blueBanner}>
				<div className={styles.bannerContent}>
					<ECareLogo className={styles.logo} size='medium' />
				</div>
			</div>

			{/* Main content */}
			<div className={styles.content}>
				<div className={styles.hero}>
					{/* FIXED: Title section with consistent spacing */}
					<div className={styles.headingContainer}>
						<h1
							className={styles.mainHeading}
							style={{ color: colors.primaryDark }}
						>
							Track what matters. <br />
							Take care of yourself,
							<span
								className={styles.highlight}
								style={{ color: colors.coral }}
							>
								&nbsp;your way.
							</span>
						</h1>

						{/* Subtitle */}
						<p
							className={styles.subtitle}
							style={{ color: colors.primaryDark }}
						>
							{welcome.subtitle}
						</p>
					</div>

					{/* FIXED: Circular Process with consistent spacing */}
					<div className={styles.circularProcessContainer}>
						<CircularProcess onFeatureClick={onFeatureClick} />
					</div>

					{/* FIXED: Call to Action with consistent spacing */}
					<div className={styles.ctaSection}>
						<Button
							onClick={onGetStarted}
							className={styles.ctaButton}
							size='medium'
							ariaLabel='Enter eCare-PD app'
						>
							{/* Button glow effect */}
							<div
								className={styles.buttonGlow}
								style={{ backgroundColor: colors.peach }}
							></div>

							<span className={styles.buttonContent}>
								<span>{welcome.cta}</span>
								<ArrowRight size={18} className={styles.buttonIcon} />
							</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WelcomePage;
