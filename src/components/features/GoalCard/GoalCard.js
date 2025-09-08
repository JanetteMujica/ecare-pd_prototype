import React from 'react';
import { Info, RefreshCw, Trash2, Watch } from 'lucide-react';
import Button from '../../ui/Button';
import { colors, createColoredShadow } from '../../../constants/colors';
import styles from './GoalCard.module.css';

const GoalCard = ({
	goal,
	onEdit,
	onDelete,
	onTrack,
	onViewInfo,
	onViewCareTips,
	onWatch,
}) => {
	const {
		id,
		name,
		short_description,
		goal_description,
		smart_watch = false,
	} = goal;

	// Create consistent styling like FeatureCard
	const cardStyles = {
		borderColor: colors.coral,
		boxShadow: createColoredShadow
			? createColoredShadow(colors.coral, 0.2)
			: `0 8px 25px -5px ${colors.coral}30, 0 10px 10px -5px ${colors.coral}20`,
	};

	const goalNameStyles = {
		color: colors.text?.primary || colors.primaryDark,
		fontWeight: 900,
	};

	const descriptionStyles = {
		color: colors.text?.primary || colors.primaryDark,
	};

	return (
		<div className={styles.card} style={cardStyles}>
			{/* Header with name and action buttons - matching FeatureCard layout */}
			<div className={styles.header}>
				<h3 className={styles.goalName} style={goalNameStyles}>
					{name}
				</h3>
				<div className={styles.actionButtons}>
					<button
						onClick={onViewInfo}
						className={styles.iconButton}
						aria-label={`View info for ${name}`}
						title='View Info'
					>
						<Info size={16} />
					</button>
					<button
						onClick={onEdit}
						className={styles.iconButton}
						aria-label={`Update ${name}`}
						title='Update Goal'
					>
						<RefreshCw size={16} />
					</button>
					<button
						onClick={onDelete}
						className={`${styles.iconButton} ${styles.deleteButton}`}
						aria-label={`Delete ${name}`}
						title='Delete Goal'
					>
						<Trash2 size={16} />
					</button>
				</div>
			</div>

			{/* Goal description - matching FeatureCard description style */}
			<div className={styles.contentContainer}>
				<div className={styles.description}>
					<p style={descriptionStyles}>
						{goal_description ||
							short_description ||
							'No description available'}
					</p>
				</div>

				{/* Action buttons row */}
				<div className={styles.actionButtonsRow}>
					{smart_watch && onWatch && (
						<button
							onClick={onWatch}
							className={styles.watchButton}
							aria-label={`Monitor ${name} with smartwatch`}
							title='Monitor with Smartwatch'
						>
							<Watch size={18} />
							<span>Watch</span>
						</button>
					)}

					<Button
						onClick={onTrack}
						variant='primary'
						size='small'
						className={styles.trackButton}
						ariaLabel={`Track progress for ${name}`}
					>
						Track
					</Button>

					<button
						onClick={onViewCareTips}
						className={styles.careTipButton}
						aria-label={`View care tips for ${name}`}
					>
						Care Tips
					</button>
				</div>
			</div>
		</div>
	);
};

export default GoalCard;
