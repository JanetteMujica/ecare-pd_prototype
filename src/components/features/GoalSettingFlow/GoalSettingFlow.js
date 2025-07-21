import React, { useState, useEffect } from 'react';
import { Check, Info, ArrowLeft, ArrowRight, Target } from 'lucide-react';
import { CafyLogoPlaceholder, ECareLogo } from '../../ui/Logo';
import { colors } from '../../../constants/colors';
import taxonomyData from '../../../data/taxonomy.json';
import './GoalSettingFlow.css';

const GoalSettingFlow = ({ onComplete, onCancel }) => {
	const [currentStep, setCurrentStep] = useState('intro');
	const [currentFlow, setCurrentFlow] = useState(null);
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [selectedOptions, setSelectedOptions] = useState({});
	const [completedFlows, setCompletedFlows] = useState(new Set());
	const [showTooltip, setShowTooltip] = useState(null);
	const [finalSelections, setFinalSelections] = useState([]);

	const flows = taxonomyData.cafy_conversation_flow.flows;
	const initialDialogue = taxonomyData.cafy_conversation_flow.initial_dialogue;
	const finalDialogue = taxonomyData.cafy_conversation_flow.final_dialogue;

	// Debug logging
	useEffect(() => {
		console.log('Current step:', currentStep);
		console.log('Selected options:', selectedOptions);
		console.log('Current flow:', currentFlow);
		console.log('Current step index:', currentStepIndex);
	}, [currentStep, selectedOptions, currentFlow, currentStepIndex]);

	// Calculate progress
	const calculateProgress = () => {
		if (currentStep === 'intro') return 0;
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

		if (currentStep === 'intro') {
			setCurrentStep('initial');
		} else if (currentStep === 'initial') {
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
					setCurrentStep('flow');
				}
			}
		} else if (currentStep === 'flow') {
			const currentFlowData = flows[currentFlow];
			const currentStepData = currentFlowData.steps[currentStepIndex];
			const stepKey = `${currentFlow}_${currentStepIndex}`;

			// Check if we need to navigate to a specific next step
			const selectedOptionIds = Object.keys(
				selectedOptions[stepKey] || {}
			).filter((key) => selectedOptions[stepKey][key]);

			// Check if any selected option has a next_step
			const nextStepOption = currentStepData.options.find(
				(opt) => selectedOptionIds.includes(opt.id) && opt.next_step
			);

			if (nextStepOption) {
				// Find the step with the specified ID
				const nextStepIndex = currentFlowData.steps.findIndex(
					(step) => step.id === nextStepOption.next_step
				);

				if (nextStepIndex !== -1) {
					setCurrentStepIndex(nextStepIndex);
					return;
				}
			}

			// Check if there are more steps in current flow
			if (currentStepIndex < currentFlowData.steps.length - 1) {
				setCurrentStepIndex(currentStepIndex + 1);
			} else {
				// Flow completed, mark as completed
				const newCompletedFlows = new Set([...completedFlows, currentFlow]);
				setCompletedFlows(newCompletedFlows);

				// Find next uncompleted flow
				const initialSelections = Object.keys(
					selectedOptions.initial || {}
				).filter((key) => selectedOptions.initial[key]);

				const nextFlowOption = initialDialogue.options.find(
					(opt) =>
						initialSelections.includes(opt.id) &&
						!newCompletedFlows.has(opt.next_flow) &&
						opt.next_flow !== currentFlow
				);

				if (nextFlowOption && nextFlowOption.next_flow) {
					setCurrentFlow(nextFlowOption.next_flow);
					setCurrentStepIndex(0);
				} else {
					// All flows completed, go to summary
					collectFinalSelections();
					setCurrentStep('summary');
				}
			}
		} else if (currentStep === 'summary') {
			const selectedSummaryOption = Object.keys(
				selectedOptions.summary || {}
			).find((key) => selectedOptions.summary[key]);

			const summaryOption = finalDialogue.options.find(
				(opt) => opt.id === selectedSummaryOption
			);

			if (summaryOption?.action === 'restart_initial_dialogue') {
				// Reset and restart
				setCurrentStep('initial');
				setCurrentFlow(null);
				setCurrentStepIndex(0);
				setSelectedOptions({});
				setCompletedFlows(new Set());
				setFinalSelections([]);
			} else {
				setCurrentStep('complete');
			}
		}
	};

	const collectFinalSelections = () => {
		const selections = [];

		Object.keys(selectedOptions).forEach((stepKey) => {
			if (stepKey === 'initial' || stepKey === 'summary') return;

			const options = selectedOptions[stepKey];
			Object.keys(options).forEach((optionId) => {
				if (options[optionId]) {
					// Find the option data to get goal_setting info
					const [flowId, stepIndex] = stepKey.split('_');
					const flowData = flows[flowId];
					if (flowData && flowData.steps[parseInt(stepIndex)]) {
						const stepData = flowData.steps[parseInt(stepIndex)];
						const optionData = stepData.options.find(
							(opt) => opt.id === optionId
						);
						if (optionData && optionData.goal_setting) {
							selections.push({
								id: optionId,
								text: optionData.goal_setting,
								description:
									optionData.short_description || optionData.definition,
							});
						}
					}
				}
			});
		});

		console.log('Final selections:', selections);
		setFinalSelections(selections);
	};

	const handleBack = () => {
		if (currentStep === 'initial') {
			setCurrentStep('intro');
		} else if (currentStep === 'flow') {
			if (currentStepIndex > 0) {
				setCurrentStepIndex(currentStepIndex - 1);
			} else {
				setCurrentStep('initial');
			}
		} else if (currentStep === 'summary') {
			// Go back to last flow
			const initialSelections = Object.keys(
				selectedOptions.initial || {}
			).filter((key) => selectedOptions.initial[key]);

			if (initialSelections.length > 0) {
				const lastFlowOption = initialDialogue.options.find((opt) =>
					initialSelections.includes(opt.id)
				);

				if (lastFlowOption && lastFlowOption.next_flow) {
					const lastFlow = lastFlowOption.next_flow;
					setCurrentFlow(lastFlow);
					const flowData = flows[lastFlow];
					setCurrentStepIndex(flowData.steps.length - 1);
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

	const renderIntro = () => (
		<div className='intro-container'>
			{/*<div className='intro-icon'>
				 <Target size={32} style={{ color: colors.primary }} />
			</div>
*/}

			<CafyLogoPlaceholder size='large' className='cafyLogo' />

			<h1 className='intro-title'>Hi there ! I am CAFY.</h1>
			{/* <p className='intro-description'>
				Hi there! I'm CAFY, your Care Assistant for You. I'm here to help you
				identify what matters most in managing your Parkinson's journey and set
				meaningful goals that work for your life.
			</p>*/}
			{/*<p className='intro-subdescription'>*/}
			<p className='intro-description'>
				This conversation will take about 5-10 minutes. We'll explore different
				areas of your health and daily life to understand your priorities and
				create a personalized care plan.
			</p>
			<button onClick={handleNext} className='next-button next-button-enabled'>
				Let's get started
			</button>
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
					{option.definition && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								setShowTooltip(showTooltip === option.id ? null : option.id);
							}}
							className='info-button'
						>
							<Info size={12} />
						</button>
					)}

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

	const renderCurrentStep = () => {
		if (currentStep === 'intro') return renderIntro();

		if (currentStep === 'initial') {
			const hasSelections = Object.keys(selectedOptions.initial || {}).some(
				(key) => selectedOptions.initial[key]
			);

			return (
				<div className='step-container'>
					<div className='step-header'>
						<h2 className='step-title'>{initialDialogue.title}</h2>
						<p className='step-message'>{initialDialogue.message}</p>
					</div>

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
				</div>
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

			const stepKey = `${currentFlow}_${currentStepIndex}`;
			const isMultiple = stepData.allow_multiple !== false;

			const hasSelections = Object.keys(selectedOptions[stepKey] || {}).some(
				(key) => selectedOptions[stepKey][key]
			);

			return (
				<div className='step-container'>
					<div className='step-header'>
						<h2 className='step-title'>{flowData.title}</h2>
						<p className='step-message'>{stepData.message}</p>
					</div>

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
				</div>
			);
		}

		if (currentStep === 'summary') {
			const hasSelection = Object.keys(selectedOptions.summary || {}).some(
				(key) => selectedOptions.summary[key]
			);

			return (
				<div className='step-container'>
					<div className='step-header'>
						<h2 className='step-title'>{finalDialogue.title}</h2>
						<p className='step-message'>{finalDialogue.message}</p>
					</div>

					<div className='summary-container'>
						<h3 className='summary-title'>Your Selected Care Priorities:</h3>
						<ul className='summary-list'>
							{finalSelections.map((selection, index) => (
								<li key={index} className='summary-item'>
									<span className='summary-bullet'>•</span>
									<span className='summary-text'>{selection.text}</span>
								</li>
							))}
						</ul>
					</div>

					<div className='options-container'>
						{finalDialogue.options.map((option) => {
							const isSelected = selectedOptions.summary?.[option.id] || false;
							return renderOptionBox(option, isSelected, false, 'summary');
						})}
					</div>

					<div className='navigation'>
						<button onClick={handleBack} className='back-button'>
							<ArrowLeft size={16} />
							<span>Back</span>
						</button>

						<button
							onClick={handleNext}
							disabled={!hasSelection}
							className={`next-button ${
								hasSelection ? 'next-button-enabled' : 'next-button-disabled'
							}`}
						>
							<span>Continue</span>
							<ArrowRight size={16} />
						</button>
					</div>
				</div>
			);
		}

		if (currentStep === 'complete') {
			return (
				<div className='intro-container'>
					<div className='intro-icon' style={{ backgroundColor: '#10b981' }}>
						<Check size={32} color='white' />
					</div>
					<h1 className='intro-title'>Great job!</h1>
					<p className='intro-description'>
						You've successfully identified your care priorities. Your
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
