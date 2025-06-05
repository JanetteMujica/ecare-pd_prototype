import React, { useState } from 'react';
import WelcomePage from './pages/WelcomePage';
import CafyIntroPage from './pages/CafyIntroPage';
import GoalsPage from './pages/GoalsPage';
import TrackingPage from './pages/TrackingPage';
import JourneyPage from './pages/JourneyPage';
import ResourcesPage from './pages/RessourcesPage';
import Navigation from './components/layout/Navigation';
import AppLayout from './components/layout/AppLayout';
import './App.css';

const App = () => {
	const [currentPage, setCurrentPage] = useState('welcome');
	const [showWelcome, setShowWelcome] = useState(true);

	// Handle getting started from welcome page
	const handleGetStarted = () => {
		setShowWelcome(false);
		setCurrentPage('cafy-intro');
	};

	// Handle navigation
	const handleNavigate = (pageId) => {
		setCurrentPage(pageId);
	};

	// Handle feature clicks from circular process
	const handleFeatureClick = (feature) => {
		setShowWelcome(false);
		setCurrentPage(feature.id);
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

	// Render page content based on current page
	const renderPage = () => {
		switch (currentPage) {
			case 'cafy-intro':
				return <CafyIntroPage onStartGoals={() => handleNavigate('goals')} />;
			case 'goals':
				return <GoalsPage />;
			case 'tracking':
				return <TrackingPage />;
			case 'journey':
				return <JourneyPage />;
			case 'resources':
				return <ResourcesPage />;
			default:
				return <CafyIntroPage onStartGoals={() => handleNavigate('goals')} />;
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
