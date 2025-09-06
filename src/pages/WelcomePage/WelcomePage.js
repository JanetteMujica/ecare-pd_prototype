import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { ECareLogo } from '../../components/ui/Logo/LogoPlaceholder';
import CircularProcess from '../../components/features/CircularProcess';
import CafyIntroPage from '../CafyIntroPage';
import GoalSettingFlow from '../../components/features/GoalSettingFlow';
import { appContent } from '../../constants/features';
import { colors } from '../../constants/colors';
import styles from './WelcomePage.module.css';

const WelcomePage = ({ onGetStarted, onFeatureClick }) => {
	const { welcome } = appContent;
	const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'cafy-intro', 'goal-setting'
	const [hasStartedGoalSetting, setHasStartedGoalSetting] = useState(false);

	const handleFeatureClick = (featureId) => {
		if (featureId === 'goals' && !hasStartedGoalSetting) {
			// First time clicking Goals - go to CAFY intro
			setCurrentView('cafy-intro');
		} else {
			// For other features or if goals already started, use the original handler
			if (onFeatureClick) {
				onFeatureClick(featureId);
			}
		}
	};

	const handleStartGoals = () => {
		// User clicked "Start Setting Goals" in CAFY intro
		setCurrentView('goal-setting');
		setHasStartedGoalSetting(true);
	};

	const handleGoalSettingComplete = (success, selections) => {
		if (success) {
			// Goals completed successfully
			console.log('Goals completed with selections:', selections);
			// You can store the selections or pass them up to parent component
			// For now, return to welcome page
			setCurrentView('welcome');
		} else {
			// User cancelled goal setting
			setCurrentView('welcome');
		}
	};

	const handleGoalSettingCancel = () => {
		// User cancelled goal setting - go back to CAFY intro
		setCurrentView('cafy-intro');
	};

	const handleCafyCancel = () => {
		// User wants to go back to welcome page from CAFY intro
		setCurrentView('welcome');
	};

	// Render different views based on current state
	if (currentView === 'cafy-intro') {
		return (
			<CafyIntroPage
				onStartGoals={handleStartGoals}
				onCancel={handleCafyCancel}
			/>
		);
	}

	if (currentView === 'goal-setting') {
		return (
			<GoalSettingFlow
				onComplete={handleGoalSettingComplete}
				onCancel={handleGoalSettingCancel}
			/>
		);
	}

	// Default welcome page view
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
						<CircularProcess onFeatureClick={handleFeatureClick} />
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
