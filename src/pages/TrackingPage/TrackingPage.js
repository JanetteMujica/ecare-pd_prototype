import React, { useState, useEffect, useRef } from 'react';
import {
	Activity,
	Laugh,
	Angry,
	Smile,
	Meh,
	Frown,
	Annoyed,
	Save,
	CheckCircle,
	ArrowRight,
} from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import { appFeatures } from '../../constants/features';
import taxonomyData from '../../data/taxonomy.json';
import styles from './TrackingPage.module.css';

const TrackingPage = ({
	onLogoClick,
	currentGoal,
	allGoals = [],
	currentGoalIndex = 0,
	onNextGoal,
}) => {
	// State for tracking data
	const [selectedRating, setSelectedRating] = useState(null);
	const [comment, setComment] = useState('');
	const [isSaved, setIsSaved] = useState(false);
	const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

	// Ref for scrolling to top
	const contentRef = useRef(null);

	// Get the tracking feature data for consistent styling
	const trackingFeature = appFeatures.find(
		(feature) => feature.id === 'tracking'
	);

	// Rating scale configuration - removed labels, added lighter background colors
	const ratingScale = [
		{ value: 5, icon: Laugh, color: '#10B981', bgColor: '#ECFDF5' },
		{ value: 4, icon: Smile, color: '#84CC16', bgColor: '#F7FEE7' },
		{ value: 3, icon: Meh, color: '#F59E0B', bgColor: '#FFFBEB' },
		{ value: 2, icon: Frown, color: '#F97316', bgColor: '#FFF7ED' },
		{ value: 1, icon: Angry, color: '#EF4444', bgColor: '#FEF2F2' },
	];

	// Function to get care tip from taxonomy
	const getCareTip = (goalId) => {
		const flows = taxonomyData.cafy_conversation_flow.flows;

		// Search through all flows and steps to find the option with this goalId
		for (const flowKey in flows) {
			const flow = flows[flowKey];
			for (const step of flow.steps) {
				if (step.options) {
					const option = step.options.find((opt) => opt.id === goalId);
					if (option && option['care-tips'] && option['care-tips'].length > 0) {
						// Find the first "Initial Educational Care Tips"
						const initialTip = option['care-tips'].find(
							(tip) => tip.type === 'Initial Educational Care Tips'
						);
						return initialTip ? initialTip.tip : option['care-tips'][0].tip;
					}
				}
			}
		}

		return 'Daily Movement Reminder: Even small movements can make a big difference. Try to incorporate gentle stretching or short walks into your daily routine. Remember, consistency is more important than intensity when building healthy habits.';
	};

	// Reset form and scroll to top when goal changes
	useEffect(() => {
		setSelectedRating(null);
		setComment('');
		setIsSaved(false);
		setShowSaveConfirmation(false);

		// Scroll to top when goal changes
		if (contentRef.current) {
			contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}, [currentGoal?.id]);

	// Handle rating selection
	const handleRatingSelect = (rating) => {
		setSelectedRating(rating);
		setIsSaved(false);
		setShowSaveConfirmation(false);
	};

	// Handle save
	const handleSave = () => {
		if (selectedRating) {
			// TODO: Save to backend/localStorage
			console.log('Saving tracking data:', {
				goalId: currentGoal?.id,
				rating: selectedRating,
				comment: comment,
				date: new Date().toISOString(),
			});

			setIsSaved(true);
			setShowSaveConfirmation(true);

			// Hide confirmation after 3 seconds
			setTimeout(() => {
				setShowSaveConfirmation(false);
			}, 3000);
		}
	};

	// Handle next goal
	const handleNextGoal = () => {
		if (allGoals.length > 1) {
			const nextIndex = (currentGoalIndex + 1) % allGoals.length;
			onNextGoal(nextIndex);
		}
	};

	return (
		<div className={styles.container}>
			<Banner onLogoClick={onLogoClick} />
			<div className={styles.content} ref={contentRef}>
				<PageTitle
					icon={trackingFeature.icon}
					title={trackingFeature.title}
					color={trackingFeature.color}
				/>

				<div className={styles.hero}>
					{/* Single Combined Card: Question + Rating + Notes */}
					<div className={styles.trackingCard}>
						{/* Question Section */}
						<h2 className={styles.questionTitle}>
							How is your{' '}
							<span className={styles.goalHighlight}>
								{currentGoal?.name || currentGoal?.title}
							</span>{' '}
							today?
						</h2>

						{/* Rating Scale */}
						<div className={styles.ratingScale}>
							{ratingScale.map((rating) => {
								const IconComponent = rating.icon;
								const isSelected = selectedRating === rating.value;

								return (
									<button
										key={rating.value}
										className={`${styles.ratingButton} ${
											isSelected ? styles.ratingButtonSelected : ''
										}`}
										onClick={() => handleRatingSelect(rating.value)}
										style={{
											borderColor: isSelected ? rating.color : rating.color,
											backgroundColor: isSelected
												? `${rating.color}30`
												: rating.bgColor,
										}}
									>
										<IconComponent color={rating.color} />
									</button>
								);
							})}
						</div>

						{/* Comment Section */}
						<div className={styles.commentSection}>
							<h3 className={styles.sectionTitle}>DIARY ENTRY</h3>
							<h3 className={styles.sectionTitle}>
								How are you feeling? Any challenges or successes to note about{' '}
								<span className={styles.goalHighlight}>
									{currentGoal?.name || currentGoal?.title}
								</span>
								?
							</h3>
							<textarea
								className={styles.commentTextarea}
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								rows={4}
							/>

							{/* Save Button */}
							<div className={styles.saveSection}>
								<button
									className={`${styles.saveButton} ${
										!selectedRating ? styles.saveButtonDisabled : ''
									}`}
									onClick={handleSave}
									disabled={!selectedRating}
								>
									{isSaved ? (
										<>
											<CheckCircle size={20} />
											Saved
										</>
									) : (
										<>
											<Save size={20} />
											Save
										</>
									)}
								</button>

								{/* Save Confirmation */}
								{showSaveConfirmation && (
									<div className={styles.saveConfirmation}>
										<CheckCircle size={16} />
										It has been saved successfully!
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Care Tip Card */}
					<div className={styles.careTipCard}>
						<h3 className={styles.careTipTitle}>Care Tip</h3>
						<p className={styles.careTipContent}>
							{getCareTip(currentGoal?.id)}
						</p>
					</div>

					{/* Next Goal Button */}
					{allGoals.length > 1 && (
						<div className={styles.nextGoalSection}>
							<button
								className={styles.nextGoalButton}
								onClick={handleNextGoal}
							>
								Next
								<ArrowRight size={20} />
							</button>
							<p className={styles.goalProgress}>
								Goal {currentGoalIndex + 1} of {allGoals.length}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TrackingPage;
