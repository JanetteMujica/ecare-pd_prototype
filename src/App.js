import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import CafyIntroPage from './pages/CafyIntroPage';
import GoalsPage from './pages/GoalsPage';
import TrackingPage from './pages/TrackingPage';
import JourneyPage from './pages/JourneyPage';
import ResourcesPage from './pages/RessourcesPage';
import GoalSettingFlow from './components/features/GoalSettingFlow';
import Navigation from './components/layout/Navigation';
import AppLayout from './components/layout/AppLayout';
import './App.css';

const App = () => {
	const [currentPage, setCurrentPage] = useState('welcome');
	const [showWelcome, setShowWelcome] = useState(true);
	const [showGoalSettingFlow, setShowGoalSettingFlow] = useState(false);
	const [goalSettingCompleted, setGoalSettingCompleted] = useState(false);
	const [goalData, setGoalData] = useState([]);
	const [cameFromWelcome, setCameFromWelcome] = useState(false); // Track if user came from welcome

	// Handle getting started from welcome page
	const handleGetStarted = () => {
		setShowWelcome(false);
		setCurrentPage('cafy-intro');
		setCameFromWelcome(false); // Regular navigation, not from welcome circular process
	};

	// Handle navigation
	const handleNavigate = (pageId) => {
		setCurrentPage(pageId);
		setShowGoalSettingFlow(false); // Hide goal flow when navigating
		setCameFromWelcome(false); // Reset welcome flag
	};

	// Handle feature clicks from circular process (Goals button on welcome page)
	const handleFeatureClick = (feature) => {
		if (feature.id === 'goals') {
			// Special case: Goals button from welcome page should go to CAFY intro
			setShowWelcome(false);
			setCurrentPage('cafy-intro');
			setCameFromWelcome(true); // Mark that we came from welcome
		} else {
			// Other features go directly to their pages
			setShowWelcome(false);
			setCurrentPage(feature.id);
			setCameFromWelcome(false);
		}
		setShowGoalSettingFlow(false); // Hide goal flow when navigating
	};

	// Handle going back to welcome from CAFY intro
	const handleCafyCancel = () => {
		if (cameFromWelcome) {
			// If we came from welcome page, go back there
			setShowWelcome(true);
			setCurrentPage('welcome');
			setCameFromWelcome(false);
		} else {
			// Otherwise, this shouldn't happen in normal flow, but handle gracefully
			setCurrentPage('goals'); // or wherever makes sense in your app
		}
	};

	// Handle starting goal setting flow from CAFY intro page
	const handleStartGoalSetting = () => {
		setShowGoalSettingFlow(true);
		// Don't change currentPage - let the flow handle its own display
	};

	// Handle completing or canceling goal setting flow
	const handleGoalSettingComplete = (completed = false, selections = []) => {
		setShowGoalSettingFlow(false);

		if (completed && selections && selections.length > 0) {
			setGoalSettingCompleted(true);
			setGoalData(selections);
			setCurrentPage('goals'); // Navigate to goals page to show results
			setCameFromWelcome(false); // Reset welcome flag
			console.log('Goal setting completed successfully!', selections);
		} else {
			// If canceled or no selections, return to CAFY intro
			setCurrentPage('cafy-intro');
			// Keep cameFromWelcome flag as is, so back button works correctly
		}
	};

	// Show welcome page
	if (showWelcome) {
		return (
			<WelcomePage
				onGetStarted={handleGetStarted}
				onFeatureClick={handleFeatureClick}
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

	// Render page content based on current page
	const renderPage = () => {
		switch (currentPage) {
			case 'cafy-intro':
				return (
					<CafyIntroPage
						onStartGoals={handleStartGoalSetting}
						onCancel={cameFromWelcome ? handleCafyCancel : null}
					/>
				);
			case 'goals':
				return (
					<GoalsPage
						onStartGoalSetting={handleStartGoalSetting}
						goalData={goalData}
						hasCompletedGoalSetting={goalSettingCompleted}
					/>
				);
			case 'tracking':
				return <TrackingPage />;
			case 'journey':
				return <JourneyPage />;
			case 'resources':
				return <ResourcesPage />;
			default:
				return <CafyIntroPage onStartGoals={handleStartGoalSetting} />;
		}
	};

	return (
		<AppLayout>
			<Navigation currentPage={currentPage} onNavigate={handleNavigate} />
			<main className='app-main'>{renderPage()}</main>
		</AppLayout>
	);
};

export default App;
