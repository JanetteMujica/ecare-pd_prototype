import React from 'react';
import { ShipWheel, ArrowRight } from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import GoalCard from '../../components/features/GoalCard';
import Button from '../../components/ui/Button';
import { colors } from '../../constants/colors';
import { appFeatures, appContent } from '../../constants/features';
import styles from './GoalsPage.module.css';

const GoalsPage = ({
	goals = [],
	onEditGoal,
	onDeleteGoal,
	onTrackGoal,
	onViewInfo,
	onViewCareTips,
	onWatchGoal,
	onBeginCareJourney, // NEW: Handler for the "Begin Your Care Journey" button
}) => {
	// Get the goals feature data for consistent styling
	const goalsFeature = appFeatures.find((feature) => feature.id === 'goals');
	const { welcome } = appContent;

	const handleEditGoal = (goalId) => {
		if (onEditGoal) {
			onEditGoal(goalId);
		}
	};

	const handleDeleteGoal = (goalId) => {
		if (onDeleteGoal) {
			onDeleteGoal(goalId);
		}
	};

	const handleTrackGoal = (goalId) => {
		if (onTrackGoal) {
			onTrackGoal(goalId);
		}
	};

	const handleViewInfo = (goalId) => {
		if (onViewInfo) {
			onViewInfo(goalId);
		}
	};

	const handleViewCareTips = (goalId) => {
		if (onViewCareTips) {
			onViewCareTips(goalId);
		}
	};

	const handleWatchGoal = (goalId) => {
		if (onWatchGoal) {
			onWatchGoal(goalId);
		}
	};

	// NEW: Handle "Begin Your Care Journey" button click
	const handleBeginJourney = () => {
		if (onBeginCareJourney) {
			onBeginCareJourney();
		}
	};

	if (!goals || goals.length === 0) {
		return (
			<div className={styles.container}>
				{/* Banner with eCare-PD logo */}
				<Banner />

				{/* Page Title */}
				<PageTitle
					icon={goalsFeature.icon}
					title={goalsFeature.title}
					color={goalsFeature.color}
				/>

				{/* Empty state with "Begin Your Care Journey" button */}
				<div className={styles.emptyState}>
					<h2 className={styles.emptyTitle}>No Goal Selected</h2>
					<p className={styles.emptyDescription}>
						Please select goals with CAFY
					</p>

					{/* Begin Your Care Journey Button */}
					<div className={styles.ctaSection}>
						<Button
							onClick={handleBeginJourney}
							className={styles.ctaButton}
							size='medium'
							ariaLabel='Begin Your Care Journey'
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
		);
	}

	return (
		<div className={styles.container}>
			{/* Banner with eCare-PD logo - FIXED: Banner comes first */}
			<Banner />

			{/* Page Title below banner - FIXED: PageTitle comes after Banner
			<PageTitle
				icon={goalsFeature.icon}
				title={goalsFeature.title}
				color={goalsFeature.color}
			/>*/}

			{/* Main content */}
			<div className={styles.content}>
				<div className={styles.hero}>
					{/* REMOVED: Old headingContainer with title and icon */}

					<PageTitle
						icon={goalsFeature.icon}
						title={goalsFeature.title}
						color={goalsFeature.color}
					/>

					{/* Goals container - starts directly */}
					<div className={styles.goalsContainer}>
						{goals.map((goal) => (
							<GoalCard
								key={goal.id}
								goal={goal}
								onEdit={() => handleEditGoal(goal.id)}
								onDelete={() => handleDeleteGoal(goal.id)}
								onTrack={() => handleTrackGoal(goal.id)}
								onViewInfo={() => handleViewInfo(goal.id)}
								onViewCareTips={() => handleViewCareTips(goal.id)}
								onWatch={
									goal.smart_watch ? () => handleWatchGoal(goal.id) : null
								}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GoalsPage;
