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
} from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import TrackingComparison from '../../components/features/TrackingComparison';
import DiaryEntries from '../../components/features/DiaryEntries';
import { appFeatures } from '../../constants/features';
import styles from './JourneyPage.module.css';

const JourneyPage = ({ onLogoClick, goals = [] }) => {
	const [selectedPeriod, setSelectedPeriod] = useState('This Week');

	// Get the journey feature data for consistent styling
	const journeyFeature = appFeatures.find(
		(feature) => feature.id === 'journey'
	);

	// Time period options
	const timePeriods = ['This Week', 'This Month', '6 Months'];

	// Allison's data - reflects her story as a recently diagnosed teacher managing symptoms
	const dashboardData = {
		trackingScore: {
			average: 3.1, // Slightly above average as she's actively managing her condition
			icon: TrendingUp,
			label: 'Tracking Score',
		},
		journalEntries: {
			average: 42, // More detailed entries as she's learning to manage her condition
			unit: 'words/day',
			icon: NotebookPen,
			label: 'Writing Diary',
		},
		medicationAdherence: {
			percentage: 85, // Good adherence as she's focused on managing side effects
			icon: PillBottle,
			label: 'Sticking to meds',
		},
		watchData: {
			steps: { value: 4200, label: 'steps', icon: Footprints }, // Moderate activity, trying to stay active for teaching
			calories: { value: 1450, label: 'calories', icon: Flame }, // Appropriate for her age and activity level
			sleep: {
				value: '5h 30m', // Reflects her sleep disturbance symptoms
				label: 'sleep',
				icon: BedSingle,
			},
			heartRate: {
				value: 68, // Slightly elevated due to stress and medication
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
							</div>
						</div>

						{/* Medical Watch Data Card */}
						<div className={styles.dashboardCard}>
							<div className={styles.cardHeader}>
								<Watch className={styles.cardIcon} />
								<span className={styles.cardLabel}>Daily movement</span>
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
