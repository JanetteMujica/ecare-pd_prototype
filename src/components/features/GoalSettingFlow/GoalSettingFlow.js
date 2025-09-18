import React, { useState, useEffect } from 'react';
import { Check, ArrowLeft, ArrowRight, Target } from 'lucide-react';
import { CafyLogoPlaceholder, ECareLogo } from '../../ui/Logo';
import { colors } from '../../../constants/colors';
import taxonomyData from '../../../data/taxonomy.json';
import './GoalSettingFlow.css';

const GoalSettingFlow = ({ onComplete, onCancel }) => {
	const [currentStep, setCurrentStep] = useState('initial');
	const [currentFlow, setCurrentFlow] = useState(null);
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [selectedOptions, setSelectedOptions] = useState({});
	const [completedFlows, setCompletedFlows] = useState(new Set());
	const [showTooltip, setShowTooltip] = useState(null);
	const [finalSelections, setFinalSelections] = useState([]);
	const [showingAfterSelection, setShowingAfterSelection] = useState(false);

	const flows = taxonomyData.cafy_conversation_flow.flows;
	const initialDialogue = taxonomyData.cafy_conversation_flow.initial_dialogue;
	const finalDialogue = taxonomyData.cafy_conversation_flow.final_dialogue;

	// Scroll to top function
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth',
		});
	};

	// Debug logging
	useEffect(() => {
		console.log('Current step:', currentStep);
		console.log('Selected options:', selectedOptions);
		console.log('Current flow:', currentFlow);
		console.log('Current step index:', currentStepIndex);
		console.log('Final selections:', finalSelections);
	}, [
		currentStep,
		selectedOptions,
		currentFlow,
		currentStepIndex,
		finalSelections,
	]);

	// Scroll to top whenever the step changes
	useEffect(() => {
		scrollToTop();
	}, [currentStep, currentStepIndex, showingAfterSelection]);

	// Calculate progress
	const calculateProgress = () => {
		if (currentStep === 'initial') return 10;
		if (currentStep === 'flow') {
			const totalSteps = completedFlows.size + (currentFlow ? 1 : 0);
			const maxFlows = Object.keys(flows).length;
			return 10 + (totalSteps / maxFlows) * 70;
		}
		if (currentStep === 'summary') return 90;
		if (currentStep === 'complete') return 100;
		return 0;
	};

	const handleOptionSelect = (optionId, isMultiple = false) => {
		const stepKey =
			currentStep === 'initial'
				? 'initial'
				: `${currentFlow}_${currentStepIndex}`;

		console.log(
			'Selecting option:',
			optionId,
			'for step:',
			stepKey,
			'multiple:',
			isMultiple
		);

		if (isMultiple) {
			setSelectedOptions((prev) => ({
				...prev,
				[stepKey]: {
					...prev[stepKey],
					[optionId]: !prev[stepKey]?.[optionId],
				},
			}));
		} else {
			setSelectedOptions((prev) => ({
				...prev,
				[stepKey]: { [optionId]: true },
			}));
		}
	};

	const handleNext = () => {
		console.log('handleNext called, current step:', currentStep);

		if (currentStep === 'initial') {
			const selectedFlows = Object.keys(selectedOptions.initial || {}).filter(
				(key) => selectedOptions.initial[key]
			);

			console.log('Selected flows:', selectedFlows);

			if (selectedFlows.length > 0) {
				// Find the corresponding flow ID from the initial dialogue options
				const firstFlowOption = initialDialogue.options.find((opt) =>
					selectedFlows.includes(opt.id)
				);

				if (firstFlowOption && firstFlowOption.next_flow) {
					const firstFlow = firstFlowOption.next_flow;
					console.log('Moving to flow:', firstFlow);
					setCurrentFlow(firstFlow);
					setCurrentStepIndex(0);
					setShowingAfterSelection(false);
					setCurrentStep('flow');
				}
			}
		} else if (currentStep === 'flow') {
			const currentFlowData = flows[currentFlow];
			const currentStepData = currentFlowData.steps[currentStepIndex];
			const stepKey = `${currentFlow}_${currentStepIndex}`;

			// If we just showed message_after_selection, handle the next step logic
			if (showingAfterSelection) {
				setShowingAfterSelection(false);

				// Now we need to navigate to the selected subcategory steps
				const selectedOptionIds = Object.keys(
					selectedOptions[stepKey] || {}
				).filter((key) => selectedOptions[stepKey][key]);

				// Find the first selected option that has a next_step
				const selectedOption = currentStepData.options.find(
					(opt) => selectedOptionIds.includes(opt.id) && opt.next_step
				);

				if (selectedOption) {
					// Navigate to the specific step
					const nextStepIndex = currentFlowData.steps.findIndex(
						(step) => step.id === selectedOption.next_step
					);

					if (nextStepIndex !== -1) {
						setCurrentStepIndex(nextStepIndex);
						return;
					}
				}

				// If no specific next step, check if there are more steps in current flow
				if (currentStepIndex < currentFlowData.steps.length - 1) {
					setCurrentStepIndex(currentStepIndex + 1);
				} else {
					// Flow completed, move to next flow or summary
					navigateToNextFlow();
				}
				return;
			}

			// Check if current step is a main step with message_after_selection
			if (currentStepData.message_after_selection && currentStepIndex === 0) {
				// Show the message_after_selection
				setShowingAfterSelection(true);
				return;
			}

			// For detail steps, check if we need to navigate to another selected subcategory
			if (currentStepIndex > 0) {
				// We're in a detail step, check if there are more selected subcategories to visit
				const mainStepKey = `${currentFlow}_0`;
				const selectedMainOptions = Object.keys(
					selectedOptions[mainStepKey] || {}
				).filter((key) => selectedOptions[mainStepKey][key]);

				const mainStepData = currentFlowData.steps[0];
				const selectedSubcategories = mainStepData.options.filter(
					(opt) => selectedMainOptions.includes(opt.id) && opt.next_step
				);

				// Find the current subcategory index
				const currentSubcategoryIndex = selectedSubcategories.findIndex(
					(subcat) => subcat.next_step === currentStepData.id
				);

				// Check if there's a next subcategory to visit
				if (
					currentSubcategoryIndex !== -1 &&
					currentSubcategoryIndex < selectedSubcategories.length - 1
				) {
					const nextSubcategory =
						selectedSubcategories[currentSubcategoryIndex + 1];
					const nextStepIndex = currentFlowData.steps.findIndex(
						(step) => step.id === nextSubcategory.next_step
					);

					if (nextStepIndex !== -1) {
						setCurrentStepIndex(nextStepIndex);
						return;
					}
				}

				// No more subcategories in this flow, move to next flow
				navigateToNextFlow();
				return;
			}

			// Default case: move to next step or next flow
			if (currentStepIndex < currentFlowData.steps.length - 1) {
				setCurrentStepIndex(currentStepIndex + 1);
			} else {
				navigateToNextFlow();
			}
		} else if (currentStep === 'summary') {
			setCurrentStep('complete');
		}
	};

	const navigateToNextFlow = () => {
		// Flow completed, mark as completed
		const newCompletedFlows = new Set([...completedFlows, currentFlow]);
		setCompletedFlows(newCompletedFlows);

		// Find next uncompleted flow
		const initialSelections = Object.keys(selectedOptions.initial || {}).filter(
			(key) => selectedOptions.initial[key]
		);

		const nextFlowOption = initialDialogue.options.find(
			(opt) =>
				initialSelections.includes(opt.id) &&
				!newCompletedFlows.has(opt.next_flow) &&
				opt.next_flow !== currentFlow
		);

		if (nextFlowOption && nextFlowOption.next_flow) {
			setCurrentFlow(nextFlowOption.next_flow);
			setCurrentStepIndex(0);
			setShowingAfterSelection(false);
		} else {
			// All flows completed, collect selections and go to summary
			console.log('All flows completed, collecting final selections...');
			// Use setTimeout to ensure state is updated before collecting
			setTimeout(() => {
				collectFinalSelections();
			}, 0);
			setCurrentStep('summary');
		}
	};

	const collectFinalSelections = () => {
		console.log('=== SIMPLE VERSION: COLLECTING SELECTIONS ===');
		console.log('selectedOptions:', selectedOptions);

		const selections = [];

		// Go through all selectedOptions
		Object.keys(selectedOptions).forEach((stepKey) => {
			// Skip initial and summary
			if (stepKey === 'initial' || stepKey === 'summary') {
				console.log(`Skipping ${stepKey}`);
				return;
			}

			console.log(`\nProcessing stepKey: ${stepKey}`);
			const options = selectedOptions[stepKey];
			// Handle flow IDs that contain underscores (like "physical_health")
			const parts = stepKey.split('_');
			const stepIndex = parts.pop(); // Get the last part (step index)
			const flowId = parts.join('_'); // Join the remaining parts back together
			const stepIndexNum = parseInt(stepIndex);

			console.log(`Flow: ${flowId}, Step: ${stepIndexNum}`);
			console.log(`Selected options:`, options);

			// Process each selected option
			Object.keys(options).forEach((optionId) => {
				if (options[optionId]) {
					console.log(`\n  Processing option: ${optionId}`);

					// Get the option data
					const flowData = flows[flowId];
					const stepData = flowData?.steps[stepIndexNum];
					const optionData = stepData?.options.find(
						(opt) => opt.id === optionId
					);

					if (optionData) {
						console.log(`  Option data found:`, optionData);
						console.log(`  Has goal_setting:`, optionData.goal_setting);
						console.log(`  Is detail step (>0):`, stepIndexNum > 0);

						// Include if it's a detail step (>0) OR has goal_setting: true
						if (stepIndexNum > 0 || optionData.goal_setting === true) {
							const selection = {
								id: optionId,
								name: optionData.name || optionData.text || optionId,
								short_description:
									optionData.short_description ||
									optionData.definition ||
									'No description available',
							};

							console.log(`  ✅ ADDING:`, selection);

							// Avoid duplicates
							if (!selections.some((s) => s.id === selection.id)) {
								selections.push(selection);
							}
						} else {
							console.log(
								`  ❌ SKIPPING - not a detail step and no goal_setting`
							);
						}
					} else {
						console.log(`  ❌ Option data not found for: ${optionId}`);
					}
				}
			});
		});

		console.log('\n=== FINAL RESULT ===');
		console.log(`Total selections: ${selections.length}`);
		console.log('Selections:', selections);

		setFinalSelections(selections);
	};

	const handleBack = () => {
		if (currentStep === 'flow') {
			if (showingAfterSelection) {
				setShowingAfterSelection(false);
				return;
			}

			if (currentStepIndex > 0) {
				setCurrentStepIndex(currentStepIndex - 1);
			} else {
				setCurrentStep('initial');
				setCurrentFlow(null);
			}
		} else if (currentStep === 'summary') {
			// Go back to last flow
			const initialSelections = Object.keys(
				selectedOptions.initial || {}
			).filter((key) => selectedOptions.initial[key]);

			if (initialSelections.length > 0) {
				const lastFlowOption = initialDialogue.options
					.filter((opt) => initialSelections.includes(opt.id))
					.pop();

				if (lastFlowOption && lastFlowOption.next_flow) {
					const lastFlow = lastFlowOption.next_flow;
					setCurrentFlow(lastFlow);
					const flowData = flows[lastFlow];
					setCurrentStepIndex(flowData.steps.length - 1);
					setShowingAfterSelection(false);
					setCurrentStep('flow');
				}
			}
		}
	};

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		}
	};

	const handleComplete = () => {
		if (onComplete) {
			onComplete(true, finalSelections);
		}
	};

	const renderStepWithLogo = (
		title,
		message,
		children,
		showContinueButton = false
	) => (
		<div className='step-container'>
			<div className='step-header'>
				<h2 className='step-title step-title-centered'>{title}</h2>
				<div className='logo-message-container'>
					<CafyLogoPlaceholder size='medium' className='logo-placeholder' />
					<p
						className='step-message step-message-with-logo'
						dangerouslySetInnerHTML={{ __html: message }}
					/>
				</div>
			</div>
			{children}
			{showContinueButton && (
				<div className='navigation'>
					<button onClick={handleBack} className='back-button'>
						<ArrowLeft size={16} />
						<span>Back</span>
					</button>
					<button
						onClick={handleNext}
						className='next-button next-button-enabled'
					>
						<span>Continue</span>
						<ArrowRight size={16} />
					</button>
				</div>
			)}
		</div>
	);

	const renderOptionBox = (option, isSelected, isMultiple, stepKey) => (
		<div
			key={option.id}
			onClick={() => handleOptionSelect(option.id, isMultiple)}
			className={`option-box ${isSelected ? 'option-box-selected' : ''}`}
		>
			<div className='option-content'>
				<div className='option-text-container'>
					<p className='option-text'>{option.text}</p>
				</div>

				<div className='option-controls'>
					<div className={`checkbox ${isSelected ? 'checkbox-selected' : ''}`}>
						{isSelected && <Check size={12} color='white' />}
					</div>
				</div>
			</div>

			{showTooltip === option.id && option.definition && (
				<div className='tooltip'>{option.definition}</div>
			)}
		</div>
	);

	const getSelectedAreasNames = () => {
		const stepKey = `${currentFlow}_${currentStepIndex}`;
		const selectedIds = Object.keys(selectedOptions[stepKey] || {}).filter(
			(key) => selectedOptions[stepKey][key]
		);

		const flowData = flows[currentFlow];
		const stepData = flowData.steps[currentStepIndex];
		const selectedNames = selectedIds
			.map((id) => {
				const option = stepData.options.find((opt) => opt.id === id);
				return option?.name || option?.text;
			})
			.filter(Boolean);

		return selectedNames.join(', ');
	};

	const renderCurrentStep = () => {
		if (currentStep === 'initial') {
			const hasSelections = Object.keys(selectedOptions.initial || {}).some(
				(key) => selectedOptions.initial[key]
			);

			return renderStepWithLogo(
				initialDialogue.title,
				initialDialogue.message,
				<>
					<div className='options-container'>
						{initialDialogue.options.map((option) => {
							const isSelected = selectedOptions.initial?.[option.id] || false;
							return renderOptionBox(option, isSelected, true, 'initial');
						})}
					</div>

					<div className='navigation'>
						<button onClick={handleBack} className='back-button'>
							<ArrowLeft size={16} />
							<span>Back</span>
						</button>

						<button
							onClick={handleNext}
							disabled={!hasSelections}
							className={`next-button ${
								hasSelections ? 'next-button-enabled' : 'next-button-disabled'
							}`}
						>
							<span>Continue</span>
							<ArrowRight size={16} />
						</button>
					</div>
				</>
			);
		}

		if (currentStep === 'flow') {
			const flowData = flows[currentFlow];
			if (!flowData) {
				console.error('Flow data not found for:', currentFlow);
				return <div>Error: Flow not found</div>;
			}

			const stepData = flowData.steps[currentStepIndex];
			if (!stepData) {
				console.error('Step data not found for index:', currentStepIndex);
				return <div>Error: Step not found</div>;
			}

			// Show message_after_selection if we're in that state
			if (showingAfterSelection && stepData.message_after_selection) {
				const selectedAreasNames = getSelectedAreasNames();
				const messageWithAreas = stepData.message_after_selection.replace(
					'[selected_areas_name]',
					`<strong>${selectedAreasNames}</strong>`
				);

				return renderStepWithLogo(flowData.title, messageWithAreas, null, true);
			}

			const stepKey = `${currentFlow}_${currentStepIndex}`;
			const isMultiple = stepData.allow_multiple !== false;

			const hasSelections = Object.keys(selectedOptions[stepKey] || {}).some(
				(key) => selectedOptions[stepKey][key]
			);

			return renderStepWithLogo(
				flowData.title,
				stepData.message,
				<>
					<div className='options-container'>
						{stepData.options.map((option) => {
							const isSelected = selectedOptions[stepKey]?.[option.id] || false;
							return renderOptionBox(option, isSelected, isMultiple, stepKey);
						})}
					</div>

					<div className='navigation'>
						<button onClick={handleBack} className='back-button'>
							<ArrowLeft size={16} />
							<span>Back</span>
						</button>

						<button
							onClick={handleNext}
							disabled={!hasSelections}
							className={`next-button ${
								hasSelections ? 'next-button-enabled' : 'next-button-disabled'
							}`}
						>
							<span>Continue</span>
							<ArrowRight size={16} />
						</button>
					</div>
				</>
			);
		}

		if (currentStep === 'summary') {
			return renderStepWithLogo(
				finalDialogue.title,
				finalDialogue.finalmessage_followedbyBulletList,
				<>
					<div className='summary-container'>
						<h3 className='summary-title'>
							Your Selected Self-Care Priorities:
						</h3>
						<ul className='summary-list'>
							{finalSelections.map((selection, index) => (
								<li key={index} className='summary-item'>
									<span className='summary-bullet'>• </span>
									<div className='summary-text'>
										<strong>{selection.name}</strong>
										{selection.short_description && (
											<span> : {selection.short_description}</span>
										)}
									</div>
								</li>
							))}
						</ul>
					</div>

					<div className='navigation'>
						<button onClick={handleBack} className='back-button'>
							<ArrowLeft size={16} />
							<span>Back</span>
						</button>

						<button
							onClick={handleNext}
							className='next-button next-button-enabled'
						>
							<span>Continue</span>
							<ArrowRight size={16} />
						</button>
					</div>
				</>
			);
		}

		if (currentStep === 'complete') {
			return (
				<div className='intro-container'>
					<div className='intro-icon intro-icon-success'>
						<Check size={32} color='white' />
					</div>
					<h1 className='intro-title'>Great job!</h1>
					<p className='intro-description'>
						You've successfully identified your self-care priorities. Your
						personalized goals are now ready to help guide your Parkinson's
						management journey.
					</p>
					<button
						onClick={handleComplete}
						className='next-button next-button-enabled'
					>
						View My Goals
					</button>
				</div>
			);
		}
	};

	return (
		<div className='goal-flow-container'>
			{/* Header with logo */}
			<div className='goal-flow-header'>
				<div className='header-content'>
					<ECareLogo size='medium' />
					<button onClick={handleCancel} className='cancel-button'>
						Cancel
					</button>
				</div>
			</div>

			{/* Progress bar */}
			<div className='progress-section'>
				<div className='progress-container'>
					<div className='progress-header'>
						<span className='progress-text'>Goal Setting Progress</span>
						<span className='progress-text'>
							{Math.round(calculateProgress())}%
						</span>
					</div>
					<div className='progress-bar'>
						<div
							className='progress-fill'
							style={{ width: `${calculateProgress()}%` }}
						/>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className='main-content'>{renderCurrentStep()}</div>
		</div>
	);
};

export default GoalSettingFlow;
