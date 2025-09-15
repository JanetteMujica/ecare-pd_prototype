import React, { useState } from 'react';
import {
	Map,
	Meh,
	NotebookPen,
	PillBottle,
	Watch,
	Footprints,
	Flame,
	BedSingle,
	HeartPulse,
	TrendingUp,
	ArrowRight,
} from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import TrackingComparison from '../../components/features/TrackingComparison';
import DiaryEntries from '../../components/features/DiaryEntries';
import Button from '../../components/ui/Button';
import { colors } from '../../constants/colors';
import { appFeatures, appContent } from '../../constants/features';
import styles from './JourneyPage.module.css';

const JourneyPage = ({
	onLogoClick,
	goals = [], // NEW: Accept goals prop to check if there are any goals
	onBeginCareJourney, // NEW: Handler for the "Begin Your Care Journey" button
}) => {
	const [selectedPeriod, setSelectedPeriod] = useState('This Week');

	// Get the journey feature data for consistent styling
	const journeyFeature = appFeatures.find(
		(feature) => feature.id === 'journey'
	);
	const { welcome } = appContent;

	// Time period options
	const timePeriods = ['This Week', 'This Month', '6 Months'];

	// NEW: Handle "Begin Your Care Journey" button click
	const handleBeginJourney = () => {
		if (onBeginCareJourney) {
			onBeginCareJourney();
		}
	};

	// NEW: Check if there are no goals, show empty state
	if (!goals || goals.length === 0) {
		return (
			<div className={styles.container}>
				<Banner onLogoClick={onLogoClick} />
				<div className={styles.content}>
					<PageTitle
						icon={journeyFeature.icon}
						title={journeyFeature.title}
						color={journeyFeature.color}
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

	// Simulated data - in real app this would come from tracking data and medical watch
	const dashboardData = {
		trackingScore: {
			average: 2.6,
			icon: TrendingUp,
			label: 'Tracking Score',
		},
		journalEntries: {
			average: 15,
			unit: 'words/day',
			icon: NotebookPen,
			label: 'Writing Diary',
		},
		medicationAdherence: {
			percentage: 75,
			/*status: 'needs improvement',*/
			icon: PillBottle,
			label: 'Sticking to meds',
		},
		watchData: {
			steps: { value: 3540, label: 'steps', icon: Footprints },
			calories: { value: 1230, label: 'calories', icon: Flame },
			sleep: {
				value: '6h 15m',
				label: 'sleep',
				icon: BedSingle,
			},
			heartRate: {
				value: 62,
				unit: 'bpm',
				label: 'resting heart rate',
				icon: HeartPulse,
			},
		},
	};

	const handlePeriodChange = (period) => {
		setSelectedPeriod(period);
		// In real app, this would trigger data refresh for the selected period
	};

	return (
		<div className={styles.container}>
			<Banner onLogoClick={onLogoClick} />
			<div className={styles.content}>
				<PageTitle
					icon={journeyFeature.icon}
					title={journeyFeature.title}
					color={journeyFeature.color}
				/>

				{/* Time Period Selector */}
				<div className={styles.periodSelector}>
					{timePeriods.map((period) => (
						<button
							key={period}
							className={`${styles.periodButton} ${
								selectedPeriod === period ? styles.periodButtonActive : ''
							}`}
							onClick={() => handlePeriodChange(period)}
						>
							{period}
						</button>
					))}
				</div>

				{/* Dashboard Cards - Using Flexbox */}
				<div className={styles.dashboardContainer}>
					<div className={styles.dashboardRow}>
						{/* Tracking Score Card */}
						<div className={styles.dashboardCard}>
							<div className={styles.cardHeader}>
								<dashboardData.trackingScore.icon className={styles.cardIcon} />
								<span className={styles.cardLabel}>
									{dashboardData.trackingScore.label}
								</span>
							</div>
							<div className={styles.cardValueContainer}>
								<div className={styles.cardValue}>
									{dashboardData.trackingScore.average}
								</div>
								{/* <Meh className={styles.mehIcon} />*/}
							</div>
						</div>

						{/* Journal Entries Card */}
						<div className={styles.dashboardCard}>
							<div className={styles.cardHeader}>
								<dashboardData.journalEntries.icon
									className={styles.cardIcon}
								/>
								<span className={styles.cardLabel}>
									{dashboardData.journalEntries.label}
								</span>
							</div>
							<div className={styles.cardValueContainer}>
								<div className={styles.cardValue}>
									{dashboardData.journalEntries.average}{' '}
									<span className={styles.cardUnit}>
										{dashboardData.journalEntries.unit}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className={styles.dashboardRow}>
						{/* Medication Adherence Card */}
						<div className={styles.dashboardCard}>
							<div className={styles.cardHeader}>
								<dashboardData.medicationAdherence.icon
									className={styles.cardIcon}
								/>
								<span className={styles.cardLabel}>
									{dashboardData.medicationAdherence.label}
								</span>
							</div>
							<div className={styles.cardValueContainer}>
								<div className={styles.adherenceIndicator}>
									<span>{dashboardData.medicationAdherence.percentage}%</span>
								</div>
								<div className={styles.adherenceStatus}>
									{dashboardData.medicationAdherence.status}
								</div>
							</div>
						</div>

						{/* Medical Watch Data Card */}
						<div className={styles.dashboardCard}>
							<div className={styles.cardHeader}>
								<Watch className={styles.cardIcon} />
								<span className={styles.cardLabel}>Moving daily</span>
							</div>
							<div className={styles.watchDataContainer}>
								<div className={styles.watchMetric}>
									<div className={styles.watchIconContainer}>
										<dashboardData.watchData.steps.icon
											className={styles.watchIcon}
										/>
									</div>
									<span className={styles.watchValue}>
										{dashboardData.watchData.steps.value.toLocaleString()}
									</span>
									<span className={styles.watchLabel}>
										{dashboardData.watchData.steps.label}
									</span>
								</div>
								<div className={styles.watchMetric}>
									<div className={styles.watchIconContainer}>
										<dashboardData.watchData.calories.icon
											className={styles.watchIcon}
										/>
									</div>
									<span className={styles.watchValue}>
										{dashboardData.watchData.calories.value.toLocaleString()}
									</span>
									<span className={styles.watchLabel}>
										{dashboardData.watchData.calories.label}
									</span>
								</div>
							</div>

							<div className={styles.watchMetric}>
								<div className={styles.watchIconContainer}>
									<dashboardData.watchData.sleep.icon
										className={styles.watchIcon}
									/>
								</div>
								<span className={styles.watchValue}>
									{dashboardData.watchData.sleep.value}
								</span>
								<span className={styles.watchLabel}>
									{dashboardData.watchData.sleep.label}
								</span>
							</div>
							<div className={styles.watchMetric}>
								<div className={styles.watchIconContainer}>
									<dashboardData.watchData.heartRate.icon
										className={styles.watchIcon}
									/>{' '}
								</div>
								<span className={styles.watchValue}>
									{dashboardData.watchData.heartRate.value}{' '}
									{dashboardData.watchData.heartRate.unit}
								</span>
								<span className={styles.watchLabel}>
									{dashboardData.watchData.heartRate.label}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Compare Tracking Score Section - Now with Interactive Graph */}
				<div className={styles.section}>
					<h3 className={styles.sectionTitle}>
						<TrendingUp className={styles.sectionIcon} />
						Comparing Tracking Score
					</h3>
					<TrackingComparison selectedPeriod={selectedPeriod} />
				</div>

				{/* Diary Entries Section - Replaced placeholder with actual component */}
				<div className={styles.section}>
					<h3 className={styles.sectionTitle}>
						<NotebookPen className={styles.sectionIcon} />
						Diary Entries
					</h3>
					<DiaryEntries />
				</div>
			</div>
		</div>
	);
};

export default JourneyPage;
