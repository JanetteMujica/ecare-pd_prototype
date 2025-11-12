import React, { useState, useEffect } from 'react';
import { ECareLogo } from '../../components/ui/Logo';
import Button from '../../components/ui/Button';
import { colors, createColoredShadow } from '../../constants/colors';
import taxonomyData from '../../data/taxonomy.json';
import styles from './UpdateGoalsPage.module.css';

const UpdateGoalsPage = ({ currentGoals = [], onUpdateGoals, onCancel }) => {
	const [selectedOptions, setSelectedOptions] = useState(new Set());

	// Extract all goal-setting options from taxonomy organized by flow
	const getFlowOptions = () => {
		const flows = taxonomyData.cafy_conversation_flow.flows;
		const flowOptions = {};

		const flowTitles = {
			physical_health: 'Physical Health',
			mental_health: 'Mental Health',
			medication: 'Medication Management',
			lifestyle: 'Lifestyle',
			wellbeing: 'Well-being',
		};

		const flowOrder = [
			'physical_health',
			'mental_health',
			'medication',
			'lifestyle',
			'wellbeing',
		];

		flowOrder.forEach((flowKey) => {
			if (flows[flowKey]) {
				const flow = flows[flowKey];
				const options = [];

				// Go through all steps in the flow to find goal-setting options
				flow.steps.forEach((step) => {
					if (step.options) {
						step.options.forEach((option) => {
							if (option.goal_setting) {
								options.push({
									id: option.id,
									name: option.name,
									text: option.text,
								});
							}
						});
					}
				});

				if (options.length > 0) {
					flowOptions[flowKey] = {
						title: flowTitles[flowKey],
						options: options,
					};
				}
			}
		});

		return flowOptions;
	};

	const flowOptions = getFlowOptions();

	// Initialize selected options based on current goals
	useEffect(() => {
		const initialSelected = new Set(currentGoals.map((goal) => goal.id));
		setSelectedOptions(initialSelected);
	}, [currentGoals]);

	const handleToggleOption = (optionId) => {
		const newSelected = new Set(selectedOptions);
		if (newSelected.has(optionId)) {
			newSelected.delete(optionId);
		} else {
			newSelected.add(optionId);
		}
		setSelectedOptions(newSelected);
	};

	const handleSaveChanges = () => {
		// Convert selected option IDs back to goal objects with metadata
		const flows = taxonomyData.cafy_conversation_flow.flows;
		const updatedGoals = [];

		Array.from(selectedOptions).forEach((optionId) => {
			// Find the option in taxonomy to get full details
			for (const flowKey in flows) {
				const flow = flows[flowKey];
				for (const step of flow.steps) {
					if (step.options) {
						const option = step.options.find((opt) => opt.id === optionId);
						if (option && option.goal_setting) {
							updatedGoals.push({
								id: option.id,
								name: option.name,
								text: option.text,
								smart_watch: option.smart_watch || false,
								goal_description:
									option.goal_description ||
									option.definition ||
									'No description available',
								short_description: option.short_description || option.text,
							});
							break;
						}
					}
				}
			}
		});

		onUpdateGoals(updatedGoals);
	};

	// Card styling similar to GoalCard
	const cardColor = colors.coral;
	const cardStyles = {
		borderColor: cardColor,
		boxShadow: createColoredShadow
			? createColoredShadow(cardColor, 0.4)
			: `0 8px 25px -5px ${cardColor}66, 0 10px 10px -5px ${cardColor}40`,
		'--card-color': cardColor,
		'--card-shadow-hover': createColoredShadow
			? createColoredShadow(cardColor, 0.6)
			: `0 20px 35px -5px ${cardColor}99, 0 15px 15px -5px ${cardColor}60`,
	};

	return (
		<div className={styles.container}>
			{/* Blue banner */}
			<div className={styles.blueBanner}>
				<div className={styles.bannerContent}>
					<ECareLogo size='medium' className={styles.bannerLogo} />
					{onCancel && (
						<button
							onClick={onCancel}
							className={styles.cancelButton}
							aria-label='Cancel goal update'
						>
							Close
						</button>
					)}
				</div>
			</div>

			{/* Main content */}
			<div className={styles.content}>
				<h1 className={styles.title}>Update Goals</h1>

				<div className={styles.cardsContainer}>
					{Object.entries(flowOptions).map(([flowKey, flowData]) => (
						<div key={flowKey} className={styles.updateCard} style={cardStyles}>
							<h2 className={styles.cardTitle}>{flowData.title}</h2>

							<div className={styles.optionsList}>
								{flowData.options.map((option) => (
									<div key={option.id} className={styles.optionItem}>
										<label className={styles.optionLabel}>
											<span className={styles.optionName}>{option.name}</span>
											<div className={styles.toggleContainer}>
												<input
													type='checkbox'
													className={styles.toggle}
													checked={selectedOptions.has(option.id)}
													onChange={() => handleToggleOption(option.id)}
												/>
												<span className={styles.toggleSlider}></span>
											</div>
										</label>
									</div>
								))}
							</div>
						</div>
					))}
				</div>

				<div className={styles.actionButtons}>
					<Button
						onClick={handleSaveChanges}
						variant='primary'
						size='large'
						className={styles.saveButton}
					>
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
};

export default UpdateGoalsPage;
