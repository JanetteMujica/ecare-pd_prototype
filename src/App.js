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

	// Handle getting started from welcome page
	const handleGetStarted = () => {
		setShowWelcome(false);
		setCurrentPage('cafy-intro');
	};

	// Handle navigation
	const handleNavigate = (pageId) => {
		setCurrentPage(pageId);
		setShowGoalSettingFlow(false); // Hide goal flow when navigating
	};

	// Handle feature clicks from circular process
	const handleFeatureClick = (feature) => {
		setShowWelcome(false);
		setCurrentPage(feature.id);
		setShowGoalSettingFlow(false); // Hide goal flow when navigating
	};

	// Handle starting goal setting flow
	const handleStartGoalSetting = () => {
		setShowGoalSettingFlow(true);
		setCurrentPage('goals'); // Ensure we're on the goals page
	};

	// Handle completing or canceling goal setting flow
	const handleGoalSettingComplete = (completed = false) => {
		setShowGoalSettingFlow(false);
		// If completed successfully, could show a success message or navigate somewhere
		if (completed) {
			// Optional: Add success handling here
			console.log('Goal setting completed successfully!');
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
				return <CafyIntroPage onStartGoals={handleStartGoalSetting} />;
			case 'goals':
				return <GoalsPage onStartGoalSetting={handleStartGoalSetting} />;
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
