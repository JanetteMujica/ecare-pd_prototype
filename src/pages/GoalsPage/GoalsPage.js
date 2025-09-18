import React, { useState } from 'react';
import { ShipWheel, X, Info } from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import GoalCard from '../../components/features/GoalCard';
import { appFeatures } from '../../constants/features';
import styles from './GoalsPage.module.css';

const GoalsPage = ({
	goals = [],
	onEditGoal,
	onDeleteGoal,
	onTrackGoal,
	onViewInfo,
	onViewCareTips,
	onWatchGoal,
	onLogoClick,
}) => {
	// State for info overlay
	const [showInfoOverlay, setShowInfoOverlay] = useState(false);
	const [selectedGoalInfo, setSelectedGoalInfo] = useState(null);

	// Get the goals feature data for consistent styling
	const goalsFeature = appFeatures.find((feature) => feature.id === 'goals');

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
		const goal = goals.find((g) => g.id === goalId);
		if (goal) {
			setSelectedGoalInfo(goal);
			setShowInfoOverlay(true);
		}
		// Also call the original onViewInfo if provided
		if (onViewInfo) {
			onViewInfo(goalId);
		}
	};

	const handleCloseInfo = () => {
		setShowInfoOverlay(false);
		setSelectedGoalInfo(null);
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

	// Handle overlay click (close when clicking outside the modal)
	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			handleCloseInfo();
		}
	};

	// Prevent scroll when overlay is open
	React.useEffect(() => {
		if (showInfoOverlay) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		// Cleanup on unmount
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [showInfoOverlay]);

	return (
		<div className={styles.container}>
			{/* Banner with eCare-PD logo */}
			<Banner onLogoClick={onLogoClick} />

			{/* Main content */}
			<div className={styles.content}>
				<div className={styles.hero}>
					<PageTitle
						icon={goalsFeature.icon}
						title={goalsFeature.title}
						color={goalsFeature.color}
					/>

					{/* Goals container */}
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

			{/* Info Overlay */}
			{showInfoOverlay && selectedGoalInfo && (
				<div className={styles.infoOverlay} onClick={handleOverlayClick}>
					<div className={styles.infoModal}>
						<div className={styles.infoHeader}>
							<div className={styles.infoIcon}>
								<Info size={24} color={goalsFeature.color} />
							</div>
							<h3 className={styles.infoTitle}>
								{selectedGoalInfo.name ||
									selectedGoalInfo.title ||
									'Goal Information'}
							</h3>
							<button
								className={styles.closeButton}
								onClick={handleCloseInfo}
								aria-label='Close information'
							>
								<X size={20} />
							</button>
						</div>
						<div className={styles.infoContent}>
							<p className={styles.infoDescription}>
								{selectedGoalInfo.short_description ||
									selectedGoalInfo.description ||
									'No additional information available for this goal.'}
							</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default GoalsPage;
