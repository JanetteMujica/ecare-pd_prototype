import React from 'react';
import { Lightbulb, ExternalLink, BookOpen, MapPin } from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import { colors } from '../../constants/colors';
import { appFeatures } from '../../constants/features';
import taxonomyData from '../../data/taxonomy.json';
import styles from './RessourcesPage.module.css';

const RessourcesPage = ({ goals = [], onLogoClick }) => {
	// Get the resources feature data for consistent styling
	const resourcesFeature = appFeatures.find(
		(feature) => feature.id === 'resources'
	);

	// Function to find care tips for a goal from taxonomy
	const getCareTipsForGoal = (goalId) => {
		const flows = taxonomyData.cafy_conversation_flow.flows;

		// Search through all flows and steps to find the option
		for (const flowKey in flows) {
			const flow = flows[flowKey];
			for (const step of flow.steps) {
				if (step.options) {
					const option = step.options.find((opt) => opt.id === goalId);
					if (option && option['care-tips']) {
						// Filter for Initial Educational Care Tips
						const initialTips = option['care-tips'].filter(
							(tip) => tip.type === 'Initial Educational Care Tips'
						);
						return initialTips;
					}
				}
			}
		}
		return [];
	};

	// Get all care tips for current goals
	const getAllCareTips = () => {
		const allTips = [];

		goals.forEach((goal) => {
			const tips = getCareTipsForGoal(goal.id);
			tips.forEach((tip) => {
				allTips.push({
					...tip,
					goalName: goal.name,
					goalId: goal.id,
				});
			});
		});

		return allTips;
	};

	const careTips = getAllCareTips();

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
									key={`${tip.goalId}-${tip.id}`}
									className={styles.careTipCard}
								>
									<div className={styles.careTipHeader}>
										<Lightbulb className={styles.careTipIcon} />
										<span className={styles.careTipGoal}>{tip.goalName}</span>
									</div>
									<div className={styles.careTipContent}>
										<p className={styles.careTipText}>
											{tip.tip === 'placeholder'
												? `Educational care tip for ${tip.goalName}. This personalized guidance helps you better understand and manage this aspect of your Parkinson's journey.`
												: tip.tip}
										</p>
									</div>
									<div className={styles.careTipFooter}>
										<span className={styles.careTipType}>{tip.type}</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className={styles.emptyState}>
							<Lightbulb className={styles.emptyIcon} />
							<h4 className={styles.emptyTitle}>No Care Tips Yet</h4>
							<p className={styles.emptyDescription}>
								Once you set up your goals, personalized care tips will appear
								here to help guide your Parkinson's management journey.
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
