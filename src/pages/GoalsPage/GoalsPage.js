import React from 'react';
import { ShipWheel } from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import GoalCard from '../../components/features/GoalCard';
import { colors } from '../../constants/colors';
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

	if (!goals || goals.length === 0) {
		return (
			<div className={styles.container}>
				{/* Banner with eCare-PD logo - FIXED: Banner comes first */}
				<Banner />

				{/* Page Title below banner - FIXED: PageTitle comes after Banner */}
				<PageTitle
					icon={goalsFeature.icon}
					title={goalsFeature.title}
					color={goalsFeature.color}
				/>
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
