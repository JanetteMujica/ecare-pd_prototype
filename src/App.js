import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import CafyIntroPage from './pages/CafyIntroPage';
import UpdateGoalsPage from './pages/UpdateGoalsPage';
import GoalsPage from './pages/GoalsPage';
import TrackingPage from './pages/TrackingPage';
import JourneyPage from './pages/JourneyPage';
import ResourcesPage from './pages/RessourcesPage';
import GoalSettingFlow from './components/features/GoalSettingFlow';
import Navigation from './components/layout/Navigation';
import AppLayout from './components/layout/AppLayout';
import taxonomyData from './data/taxonomy.json';
import './App.css';

const App = () => {
	const [currentPage, setCurrentPage] = useState('welcome');
	const [showWelcome, setShowWelcome] = useState(true);
	const [showGoalSettingFlow, setShowGoalSettingFlow] = useState(false);
	const [goalSettingCompleted, setGoalSettingCompleted] = useState(false);
	const [userGoals, setUserGoals] = useState([]);
	const [cameFromWelcome, setCameFromWelcome] = useState(false);
	// ADD: State to control welcome page initial view
	const [welcomeInitialView, setWelcomeInitialView] = useState('welcome');

	// ADD: New state for tracking functionality
	const [currentTrackedGoal, setCurrentTrackedGoal] = useState(null);
	const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

	// Function to find goal_description from taxonomy data
	const getGoalDescription = (goalId) => {
		const flows = taxonomyData.cafy_conversation_flow.flows;

		// Search through all flows and steps to find the option with this goalId
		for (const flowKey in flows) {
			const flow = flows[flowKey];
			for (const step of flow.steps) {
				if (step.options) {
					const option = step.options.find((opt) => opt.id === goalId);
					if (option && option.goal_description) {
						return option.goal_description;
					}
				}
			}
		}

		// Fallback to definition or default message
		for (const flowKey in flows) {
			const flow = flows[flowKey];
			for (const step of flow.steps) {
				if (step.options) {
					const option = step.options.find((opt) => opt.id === goalId);
					if (option && option.definition) {
						return option.definition;
					}
				}
			}
		}

		return 'No description available';
	};

	// Function to find smart_watch value from taxonomy data
	const getSmartWatchValue = (goalId) => {
		const flows = taxonomyData.cafy_conversation_flow.flows;

		// Search through all flows and steps to find the option with this goalId
		for (const flowKey in flows) {
			const flow = flows[flowKey];
			for (const step of flow.steps) {
				if (step.options) {
					const option = step.options.find((opt) => opt.id === goalId);
					if (option && option.hasOwnProperty('smart_watch')) {
						return option.smart_watch;
					}
				}
			}
		}

		// Default to false if not found
		return false;
	};

	// Then in handleGoalSettingComplete, change the transformation:
	const handleGoalSettingComplete = (completed = false, selections = []) => {
		console.log('Goal setting complete called:', { completed, selections });

		setShowGoalSettingFlow(false);

		if (completed && selections && selections.length > 0) {
			setGoalSettingCompleted(true);

			// Transform selections to match GoalsPage expected format
			const goalsWithMetadata = selections.map((goal) => ({
				...goal,
				smart_watch: getSmartWatchValue(goal.id),
				goal_description: getGoalDescription(goal.id),
				short_description: goal.short_description,
			}));

			setUserGoals(goalsWithMetadata);

			// IMPORTANT: Set showWelcome to false and navigate to goals
			setShowWelcome(false);
			setCurrentPage('goals');
			setCameFromWelcome(false);
			setWelcomeInitialView('welcome'); // Reset welcome view

			console.log('Navigating to goals page with:', goalsWithMetadata);
		} else {
			// If canceled, go back to cafy-intro
			setCurrentPage('cafy-intro');
		}
	};

	// Handle logo click - Navigate back to welcome page
	const handleLogoClick = () => {
		setShowWelcome(true);
		setCurrentPage('welcome');
		setShowGoalSettingFlow(false);
		setCameFromWelcome(false);
		setWelcomeInitialView('welcome'); // Reset to default welcome view
	};

	// Handle getting started from welcome page
	const handleGetStarted = () => {
		setShowWelcome(false);
		setCurrentPage('cafy-intro');
		setCameFromWelcome(false);
	};

	// FIXED: Handle CAFY button click from navigation
	const handleCafyClick = () => {
		console.log('CAFY button clicked from navigation');
		// Instead of going directly to cafy-intro page, go to welcome page
		// and set it to show the cafy-intro view
		setShowWelcome(true);
		setCurrentPage('welcome');
		setShowGoalSettingFlow(false);
		setCameFromWelcome(true);
		setWelcomeInitialView('cafy-intro'); // Start welcome page in cafy-intro view
	};

	// Handle navigation
	const handleNavigate = (pageId) => {
		setCurrentPage(pageId);
		setShowGoalSettingFlow(false);
		setCameFromWelcome(false);
		setWelcomeInitialView('welcome'); // Reset welcome view when navigating
	};

	// Handle feature clicks from circular process (Goals button on welcome page)
	const handleFeatureClick = (feature) => {
		if (feature.id === 'goals-completed') {
			// Handle goal completion from welcome page
			handleGoalSettingComplete(true, feature.selections);
			return;
		}
		if (feature.id === 'goals') {
			if (goalSettingCompleted && userGoals.length > 0) {
				// If goals already completed, go directly to goals page
				setShowWelcome(false);
				setCurrentPage('goals');
			} else {
				// First time or no goals yet, go to CAFY intro
				setShowWelcome(false);
				setCurrentPage('cafy-intro');
				setCameFromWelcome(true);
			}
		} else {
			// Other features go directly to their pages
			setShowWelcome(false);
			setCurrentPage(feature.id);
			setCameFromWelcome(false);
		}
		setShowGoalSettingFlow(false);
		setWelcomeInitialView('welcome'); // Reset welcome view
	};

	// Handle going back to welcome from CAFY intro
	const handleCafyCancel = () => {
		if (cameFromWelcome) {
			setShowWelcome(true);
			setCurrentPage('welcome');
			setCameFromWelcome(false);
			setWelcomeInitialView('welcome'); // Reset to default welcome view
		} else {
			setCurrentPage('goals');
		}
	};

	// Handle navigation to UpdateGoalsPage
	const handleUpdateGoalsViaList = () => {
		setShowWelcome(false);
		setCurrentPage('update-goals');
		setShowGoalSettingFlow(false);
		setCameFromWelcome(false);
		setWelcomeInitialView('welcome');
	};

	// Handle updating goals from UpdateGoalsPage
	const handleUpdateGoalsFromList = (updatedGoals) => {
		setUserGoals(updatedGoals);
		setCurrentPage('goals');
		console.log('Goals updated from list:', updatedGoals);
	};

	// Handle cancel from UpdateGoalsPage
	const handleUpdateGoalsCancel = () => {
		if (userGoals.length > 0) {
			setCurrentPage('goals');
		} else {
			setCurrentPage('cafy-intro');
		}
	};

	// Handle starting goal setting flow from CAFY intro page
	const handleStartGoalSetting = () => {
		setShowGoalSettingFlow(true);
	};

	// Goal management handlers
	const handleEditGoal = (goalId) => {
		console.log('Edit goal:', goalId);
		// Navigate to UpdateGoalsPage instead of restarting goal setting flow
		setCurrentPage('update-goals');
	};

	const handleDeleteGoal = (goalId) => {
		setUserGoals((prev) => prev.filter((goal) => goal.id !== goalId));
		console.log('Deleted goal:', goalId);
	};

	// UPDATED: Handle tracking goal with goal selection
	const handleTrackGoal = (goalId) => {
		console.log('Track goal:', goalId);
		// Find the goal being tracked
		const goalToTrack = userGoals.find((goal) => goal.id === goalId);
		setCurrentTrackedGoal(goalToTrack);
		setCurrentGoalIndex(userGoals.findIndex((goal) => goal.id === goalId));
		setCurrentPage('tracking');
	};

	const handleViewInfo = (goalId) => {
		console.log('View info for goal:', goalId);
		// TODO: Show goal information modal or page
	};

	const handleViewCareTips = (goalId) => {
		console.log('View care tips for goal:', goalId);
		setCurrentPage('resources');
	};

	const handleWatchGoal = (goalId) => {
		console.log('Watch goal:', goalId);
		// TODO: Implement smartwatch integration
	};

	// Show welcome page
	if (showWelcome) {
		return (
			<WelcomePage
				onGetStarted={handleGetStarted}
				onFeatureClick={handleFeatureClick}
				onLogoClick={handleLogoClick}
				initialView={welcomeInitialView} // Pass the initial view state
			/>
		);
	}

	// Show Goal Setting Flow (full screen, no navigation)
	if (showGoalSettingFlow) {
		return (
			<GoalSettingFlow
				onComplete={handleGoalSettingComplete}
				onCancel={() => handleGoalSettingComplete(false)}
			/>
		);
	}

	// Show UpdateGoalsPage (full screen, no navigation)
	if (currentPage === 'update-goals') {
		return (
			<UpdateGoalsPage
				currentGoals={userGoals}
				onUpdateGoals={handleUpdateGoalsFromList}
				onCancel={handleUpdateGoalsCancel}
			/>
		);
	}

	// Show CafyIntroPage (full screen, no navigation)
	if (currentPage === 'cafy-intro') {
		return (
			<CafyIntroPage
				onStartGoals={handleStartGoalSetting}
				onCancel={cameFromWelcome ? handleCafyCancel : null}
				onUpdateGoalsViaList={handleUpdateGoalsViaList}
				onLogoClick={handleLogoClick}
			/>
		);
	}

	// Render page content based on current page (with navigation)
	const renderPage = () => {
		console.log('Rendering page:', currentPage, 'Goals:', userGoals.length);

		switch (currentPage) {
			case 'goals':
				return (
					<GoalsPage
						goals={userGoals}
						onEditGoal={handleEditGoal}
						onDeleteGoal={handleDeleteGoal}
						onTrackGoal={handleTrackGoal}
						onViewInfo={handleViewInfo}
						onViewCareTips={handleViewCareTips}
						onWatchGoal={handleWatchGoal}
						onUpdateGoalsViaList={handleUpdateGoalsViaList}
						onLogoClick={handleLogoClick}
					/>
				);
			case 'tracking':
				return (
					<TrackingPage
						onLogoClick={handleLogoClick}
						currentGoal={currentTrackedGoal}
						allGoals={userGoals}
						currentGoalIndex={currentGoalIndex}
						onNextGoal={(nextIndex) => {
							setCurrentGoalIndex(nextIndex);
							setCurrentTrackedGoal(userGoals[nextIndex]);
						}}
					/>
				);
			case 'journey':
				return <JourneyPage onLogoClick={handleLogoClick} />;
			case 'resources':
				return <ResourcesPage onLogoClick={handleLogoClick} />;
			default:
				return (
					<GoalsPage
						goals={userGoals}
						onEditGoal={handleEditGoal}
						onDeleteGoal={handleDeleteGoal}
						onTrackGoal={handleTrackGoal}
						onViewInfo={handleViewInfo}
						onViewCareTips={handleViewCareTips}
						onWatchGoal={handleWatchGoal}
						onUpdateGoalsViaList={handleUpdateGoalsViaList}
						onLogoClick={handleLogoClick}
					/>
				);
		}
	};

	return (
		<AppLayout>
			<Navigation
				currentPage={currentPage}
				onNavigate={handleNavigate}
				onCafyClick={handleCafyClick}
			/>
			<main className='app-main'>{renderPage()}</main>
		</AppLayout>
	);
};

export default App;
