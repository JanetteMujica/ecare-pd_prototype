import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/ui/Button';
import { ECareLogo } from '../../components/ui/Logo/LogoPlaceholder';
import CircularProcess from '../../components/features/CircularProcess';
import CafyIntroPage from '../CafyIntroPage';
import GoalSettingFlow from '../../components/features/GoalSettingFlow';
import { appContent } from '../../constants/features';
import { colors } from '../../constants/colors';
import styles from './WelcomePage.module.css';
import Banner from '../../components/layout/Banner';

const WelcomePage = ({
	onGetStarted,
	onFeatureClick,
	onLogoClick,
	onUpdateGoalsViaList, // ADD: New prop for updating goals via list
	initialView = 'welcome',
}) => {
	// ADD: Accept onLogoClick prop and initialView prop
	const { welcome } = appContent;
	const [currentView, setCurrentView] = useState(initialView); // Use initialView prop
	const [hasStartedGoalSetting, setHasStartedGoalSetting] = useState(false);

	// Handle initialView changes
	useEffect(() => {
		setCurrentView(initialView);
	}, [initialView]);

	const handleFeatureClick = (feature) => {
		if (feature.id === 'goals' && !hasStartedGoalSetting) {
			// First time clicking Goals - go to CAFY intro
			setCurrentView('cafy-intro');
		} else {
			// For other features or if goals already started, use the original handler
			if (onFeatureClick) {
				onFeatureClick(feature);
			}
		}
	};

	// NEW: Handle "Begin Your Care Journey" button the same way as Goals feature card
	const handleBeginJourney = () => {
		if (!hasStartedGoalSetting) {
			// First time - go to CAFY intro (same as Goals feature card)
			setCurrentView('cafy-intro');
		} else {
			// If goals already started, use the original handler
			if (onGetStarted) {
				onGetStarted();
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
			// Goals completed successfully - pass to parent to handle navigation
			console.log('Goals completed with selections:', selections);
			setHasStartedGoalSetting(true);

			// Call the parent's feature click handler to properly navigate
			if (onFeatureClick) {
				// Create a custom event to trigger the app's goal completion logic
				onFeatureClick({
					id: 'goals-completed',
					selections: selections,
				});
			}
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
				onUpdateGoalsViaList={onUpdateGoalsViaList} // PASS: the prop through
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
			{/* Banner with clickable logo - Pass onLogoClick */}
			<Banner onLogoClick={onLogoClick} />
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
							onClick={handleBeginJourney}
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
