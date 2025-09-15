import React, { useState } from 'react';
import {
	ExternalLink,
	BookOpen,
	MapPin,
	ChevronRight,
	ArrowRight,
} from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import Button from '../../components/ui/Button';
import { colors } from '../../constants/colors';
import { appFeatures, appContent } from '../../constants/features';
import taxonomyData from '../../data/taxonomy.json';
import styles from './RessourcesPage.module.css';

const RessourcesPage = ({
	goals = [],
	onLogoClick,
	onBeginCareJourney, // NEW: Handler for the "Begin Your Care Journey" button
}) => {
	// State to track current care tip index for each goal
	const [currentTipIndices, setCurrentTipIndices] = useState({});

	// Get the resources feature data for consistent styling
	const resourcesFeature = appFeatures.find(
		(feature) => feature.id === 'resources'
	);
	const { welcome } = appContent;

	// Function to find all care tips for a goal from taxonomy
	const getAllCareTipsForGoal = (goalId) => {
		const flows = taxonomyData.cafy_conversation_flow.flows;

		// Search through all flows and steps to find the option
		for (const flowKey in flows) {
			const flow = flows[flowKey];
			for (const step of flow.steps) {
				if (step.options) {
					const option = step.options.find((opt) => opt.id === goalId);
					if (option && option['care-tips']) {
						// Return all care tips (should be 11 total)
						return option['care-tips'];
					}
				}
			}
		}
		return [];
	};

	// Function to get the current care tip for a specific goal
	const getCurrentCareTipForGoal = (goalId) => {
		const allTips = getAllCareTipsForGoal(goalId);
		if (allTips.length === 0) return null;

		const currentIndex = currentTipIndices[goalId] || 0;
		return allTips[currentIndex] || allTips[0];
	};

	// Handle clicking the next care tip button
	const handleNextCareTip = (goalId) => {
		const allTips = getAllCareTipsForGoal(goalId);
		if (allTips.length === 0) return;

		setCurrentTipIndices((prev) => {
			const currentIndex = prev[goalId] || 0;
			const nextIndex = (currentIndex + 1) % allTips.length; // Cycle back to 0 after reaching the end
			return {
				...prev,
				[goalId]: nextIndex,
			};
		});
	};

	// NEW: Handle "Begin Your Care Journey" button click
	const handleBeginJourney = () => {
		if (onBeginCareJourney) {
			onBeginCareJourney();
		}
	};

	// Get current care tips for all goals (one tip per goal)
	const getCurrentCareTips = () => {
		const currentTips = [];

		goals.forEach((goal) => {
			const currentTip = getCurrentCareTipForGoal(goal.id);
			if (currentTip) {
				currentTips.push({
					...currentTip,
					goalName: goal.name,
					goalId: goal.id,
				});
			}
		});

		// DEBUGGING: Log the results
		console.log('Goals received:', goals);
		console.log('Current care tips:', currentTips);

		return currentTips;
	};

	const careTips = getCurrentCareTips();

	// NEW: Check if there are no goals, show empty state
	if (!goals || goals.length === 0) {
		return (
			<div className={styles.container}>
				{/* Banner with clickable logo */}
				<Banner onLogoClick={onLogoClick} />

				{/* Main content */}
				<div className={styles.content}>
					{/* Page Title */}
					<PageTitle
						icon={resourcesFeature.icon}
						title={resourcesFeature.title}
						color={resourcesFeature.color}
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
			</div>
		);
	}

	return (
		<div className={styles.container}>
			{/* Banner with clickable logo */}
			<Banner onLogoClick={onLogoClick} />

			{/* Main content */}
			<div className={styles.content}>
				{/* Page Title */}
				<PageTitle
					icon={resourcesFeature.icon}
					title={resourcesFeature.title}
					color={resourcesFeature.color}
				/>

				{/* My Library of Care-tips Section */}
				<div className={styles.section}>
					<h3 className={styles.sectionTitle}>
						<BookOpen className={styles.sectionIcon} />
						My Library of Care-tips
					</h3>

					{careTips.length > 0 ? (
						<div className={styles.careTipsGrid}>
							{careTips.map((tip, index) => (
								<div
									key={`${tip.goalId}-${tip.id}-${index}`}
									className={styles.careTipCard}
								>
									<div className={styles.careTipHeader}>
										<span className={styles.careTipGoal}>{tip.goalName}</span>
									</div>
									<div className={styles.careTipContent}>
										<p className={styles.careTipText}>
											<span className={styles.careTipId}>#{tip.id}</span>
											{tip.tip === 'placeholder' ||
											tip.tip === 'Initial Educational Care Tips' ||
											tip.tip === 'Educational Care Tips' ||
											tip.tip === 'Reinforcement-Educational Care Tips' ||
											tip.tip === 'Initial Basic Care Tips' ||
											tip.tip === 'Basic Care Tips' ||
											tip.tip === 'Reinforcement - Basic Care Tips' ||
											tip.tip === 'Initial Advanced Care Tips' ||
											tip.tip === 'Advance Care Tips' ||
											tip.tip === 'Reinforcement-Advanced Care Tips' ||
											tip.tip === 'Escalation Care Tips'
												? `This is a ${tip.type.toLowerCase()} for managing ${tip.goalName.toLowerCase()}. The specific care tip content will be updated in the taxonomy.`
												: tip.tip}
										</p>
									</div>
									<div className={styles.careTipFooter}>
										<span className={styles.careTipType}>{tip.type}</span>
										<button
											className={styles.nextTipButton}
											onClick={() => handleNextCareTip(tip.goalId)}
											title='Next care tip'
										>
											<ChevronRight className={styles.nextTipIcon} />
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className={styles.emptyState}>
							<h4 className={styles.emptyTitle}>No Care Tips Yet</h4>
							<p className={styles.emptyDescription}>
								{goals.length === 0
									? "Once you set up your goals, personalized care tips will appear here to help guide your Parkinson's management journey."
									: "We're working on loading your personalized care tips. Please check back soon."}
							</p>
						</div>
					)}
				</div>

				{/* Care Finder Section */}
				<div className={styles.section}>
					<h3 className={styles.sectionTitle}>
						<MapPin className={styles.sectionIcon} />
						Care Finder
					</h3>

					<div className={styles.careFinderContent}>
						<p className={styles.careFinderDescription}>
							Find local support and services for Parkinson's care.
						</p>

						<a
							href='https://carefinder.parkinson.ca/'
							target='_blank'
							rel='noopener noreferrer'
							className={styles.careFinderLink}
						>
							<span>Visit Care Finder</span>
							<ExternalLink className={styles.externalLinkIcon} />
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RessourcesPage;
