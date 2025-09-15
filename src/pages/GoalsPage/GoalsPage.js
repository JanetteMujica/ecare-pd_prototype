import React from 'react';
import { ShipWheel } from 'lucide-react';
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
		</div>
	);
};

export default GoalsPage;
