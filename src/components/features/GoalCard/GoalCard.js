import React from 'react';
import { Info, RefreshCw, Trash2, Watch } from 'lucide-react';
import Button from '../../ui/Button';
import { colors } from '../../../constants/colors';
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
	const { id, name, goal_description, smart_watch = false } = goal;

	const goalNameStyles = {
		color: colors.text?.primary || colors.primaryDark,
		fontWeight: 900,
	};

	const descriptionStyles = {
		color: colors.text?.primary || colors.primaryDark,
	};

	// Handler for update/edit button click
	const handleUpdateClick = () => {
		if (onEdit) {
			onEdit(id);
		}
	};

	return (
		<div className={styles.card}>
			{/* Header with name and action buttons */}
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
						<Info size={25} />
					</button>
					{/*	<button
						onClick={handleUpdateClick}
						className={styles.iconButton}
						aria-label={`Update ${name}`}
						title='Update Goal'
					>
						<RefreshCw size={16} />
					</button> */}
					<button
						onClick={() => onDelete && onDelete(id)}
						className={`${styles.iconButton} ${styles.deleteButton}`}
						aria-label={`Delete ${name}`}
						title='Delete Goal'
					>
						<Trash2 size={25} />
					</button>
				</div>
			</div>

			{/* Goal description */}
			<div className={styles.contentContainer}>
				<div className={styles.description}>
					<p style={descriptionStyles}>
						{goal_description || 'No description available'}
					</p>
				</div>

				{/* Action buttons row */}
				<div className={styles.actionButtonsRow}>
					{smart_watch && onWatch && (
						<button
							onClick={() => onWatch(id)}
							className={styles.watchButton}
							aria-label={`Monitor ${name} with smartwatch`}
							title='Monitor with Smartwatch'
						>
							<Watch size={18} />
							<span>Watch</span>
						</button>
					)}

					<Button
						onClick={() => onTrack && onTrack(id)}
						variant='primary'
						size='small'
						className={styles.trackButton}
						ariaLabel={`Track progress for ${name}`}
					>
						Track
					</Button>

					<button
						onClick={() => onViewCareTips && onViewCareTips(id)}
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
