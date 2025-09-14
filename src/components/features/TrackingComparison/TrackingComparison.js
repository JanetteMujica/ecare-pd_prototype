import React, { useState, useEffect } from 'react';
import {
	Laugh,
	Smile,
	Meh,
	Frown,
	Angry,
	TrendingUp,
	ChevronDown,
} from 'lucide-react';
import {
	trackingOptions,
	getComparisonData,
} from '../../../data/syntheticTrackingData';
import styles from './TrackingComparison.module.css';

const TrackingComparison = ({ selectedPeriod = 'This Week' }) => {
	const [tracking1, setTracking1] = useState('tremor');
	const [tracking2, setTracking2] = useState('balance');
	const [comparisonData, setComparisonData] = useState(null);

	// Emoji components mapping
	const emojiMap = {
		5: { component: Laugh, color: '#10B981', label: 'Excellent' },
		4: { component: Smile, color: '#84CC16', label: 'Good' },
		3: { component: Meh, color: '#F59E0B', label: 'Okay' },
		2: { component: Frown, color: '#F97316', label: 'Poor' },
		1: { component: Angry, color: '#EF4444', label: 'Very Poor' },
	};

	// Get tracking option name by id
	const getTrackingName = (id) => {
		const option = trackingOptions.find((opt) => opt.id === id);
		return option ? option.name : id;
	};

	// Format date for display
	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${month}/${day}`;
	};

	// Load comparison data when selections change
	useEffect(() => {
		if (tracking1 && tracking2) {
			const data = getComparisonData(tracking1, tracking2, selectedPeriod);
			setComparisonData(data);
		}
	}, [tracking1, tracking2, selectedPeriod]);

	// Group tracking options by category for better UX
	const groupedOptions = trackingOptions.reduce((acc, option) => {
		if (!acc[option.category]) {
			acc[option.category] = [];
		}
		acc[option.category].push(option);
		return acc;
	}, {});

	// Render dropdown with grouped options
	const renderDropdown = (value, onChange, label, excludeId = null) => (
		<div className={styles.dropdownContainer}>
			<label className={styles.dropdownLabel}>{label}</label>
			<div className={styles.selectWrapper}>
				<select
					className={styles.dropdown}
					value={value}
					onChange={(e) => onChange(e.target.value)}
				>
					{Object.entries(groupedOptions).map(([category, options]) => (
						<optgroup key={category} label={category}>
							{options
								.filter((option) => option.id !== excludeId)
								.map((option) => (
									<option key={option.id} value={option.id}>
										{option.name}
									</option>
								))}
						</optgroup>
					))}
				</select>
				<ChevronDown className={styles.dropdownIcon} />
			</div>
		</div>
	);

	// Calculate graph dimensions and positions
	const graphWidth = 100; // percentage
	const graphHeight = 200; // pixels
	const padding = { top: 20, right: 20, bottom: 40, left: 40 };

	// Render the line graph
	const renderGraph = () => {
		if (!comparisonData || !comparisonData.tracking1.length) {
			return (
				<div className={styles.graphPlaceholder}>
					<TrendingUp className={styles.placeholderIcon} />
					<p>Select tracking options to view comparison</p>
				</div>
			);
		}

		const data1 = comparisonData.tracking1;
		const data2 = comparisonData.tracking2;
		const totalWidth = 400;
		const totalHeight = graphHeight;
		const chartWidth = totalWidth - padding.left - padding.right;
		const chartHeight = totalHeight - padding.top - padding.bottom;

		// Calculate positions for data points
		const getXPosition = (index, total) => {
			return padding.left + (index / (total - 1)) * chartWidth;
		};

		const getYPosition = (score) => {
			return padding.top + ((5 - score) / 4) * chartHeight;
		};

		// Create path data for lines
		const createLinePath = (data) => {
			return data
				.map((point, index) => {
					const x = getXPosition(index, data.length);
					const y = getYPosition(point.rawScore);
					return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
				})
				.join(' ');
		};

		const path1 = createLinePath(data1);
		const path2 = createLinePath(data2);

		return (
			<div className={styles.graphContainer}>
				<svg
					width='100%'
					height={totalHeight}
					viewBox={`0 0 ${totalWidth} ${totalHeight}`}
					className={styles.graph}
				>
					{/* Y-axis labels (emoji scale) */}
					{[1, 2, 3, 4, 5].map((score) => {
						const EmojiComponent = emojiMap[score].component;
						const y = getYPosition(score);
						return (
							<g key={score}>
								<line
									x1={padding.left - 5}
									y1={y}
									x2={padding.left}
									y2={y}
									stroke='#9CA3AF'
									strokeWidth='1'
								/>
								<foreignObject
									x={padding.left - 35}
									y={y - 12}
									width='24'
									height='24'
								>
									<EmojiComponent
										size={20}
										color={emojiMap[score].color}
										className={styles.axisEmoji}
									/>
								</foreignObject>
							</g>
						);
					})}

					{/* Grid lines */}
					{[1, 2, 3, 4, 5].map((score) => {
						const y = getYPosition(score);
						return (
							<line
								key={`grid-${score}`}
								x1={padding.left}
								y1={y}
								x2={totalWidth - padding.right}
								y2={y}
								stroke='#F3F4F6'
								strokeWidth='1'
								strokeDasharray='2,2'
							/>
						);
					})}

					{/* X-axis */}
					<line
						x1={padding.left}
						y1={totalHeight - padding.bottom}
						x2={totalWidth - padding.right}
						y2={totalHeight - padding.bottom}
						stroke='#9CA3AF'
						strokeWidth='1'
					/>

					{/* Y-axis */}
					<line
						x1={padding.left}
						y1={padding.top}
						x2={padding.left}
						y2={totalHeight - padding.bottom}
						stroke='#9CA3AF'
						strokeWidth='1'
					/>

					{/* Data lines */}
					<path
						d={path1}
						fill='none'
						stroke='var(--color-coral)'
						strokeWidth='3'
						className={styles.dataLine}
					/>
					<path
						d={path2}
						fill='none'
						stroke='#3B82F6'
						strokeWidth='3'
						className={styles.dataLine}
					/>

					{/* Data points */}
					{data1.map((point, index) => {
						const x = getXPosition(index, data1.length);
						const y = getYPosition(point.rawScore);
						return (
							<circle
								key={`point1-${index}`}
								cx={x}
								cy={y}
								r='4'
								fill='var(--color-coral)'
								stroke='white'
								strokeWidth='2'
								className={styles.dataPoint}
							/>
						);
					})}

					{data2.map((point, index) => {
						const x = getXPosition(index, data2.length);
						const y = getYPosition(point.rawScore);
						return (
							<circle
								key={`point2-${index}`}
								cx={x}
								cy={y}
								r='4'
								fill='#3B82F6'
								stroke='white'
								strokeWidth='2'
								className={styles.dataPoint}
							/>
						);
					})}

					{/* X-axis labels */}
					{data1.map((point, index) => {
						if (
							index % Math.ceil(data1.length / 5) === 0 ||
							index === data1.length - 1
						) {
							const x = getXPosition(index, data1.length);
							return (
								<text
									key={`xlabel-${index}`}
									x={x}
									y={totalHeight - padding.bottom + 20}
									textAnchor='middle'
									className={styles.axisLabel}
									fontSize='10'
									fill='#6B7280'
								>
									{formatDate(point.date)}
								</text>
							);
						}
						return null;
					})}
				</svg>

				{/* Legend */}
				<div className={styles.legend}>
					<div className={styles.legendItem}>
						<div
							className={styles.legendColor}
							style={{ backgroundColor: 'var(--color-coral)' }}
						/>
						<span className={styles.legendLabel}>
							{getTrackingName(tracking1)}
						</span>
					</div>
					<div className={styles.legendItem}>
						<div
							className={styles.legendColor}
							style={{ backgroundColor: '#3B82F6' }}
						/>
						<span className={styles.legendLabel}>
							{getTrackingName(tracking2)}
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className={styles.container}>
			<div className={styles.controls}>
				{renderDropdown(
					tracking1,
					setTracking1,
					'Compare Tracking 1:',
					tracking2
				)}
				{renderDropdown(tracking2, setTracking2, 'With Tracking 2:', tracking1)}
			</div>

			{renderGraph()}
		</div>
	);
};

export default TrackingComparison;
