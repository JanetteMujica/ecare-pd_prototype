import React from 'react';
import { Activity } from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import { colors } from '../../constants/colors';
import { appFeatures } from '../../constants/features';
import styles from './TrackingPage.module.css';

const TrackingPage = ({ onLogoClick }) => {
	// ADD: Accept onLogoClick prop
	// Get the tracking feature data for consistent styling
	const trackingFeature = appFeatures.find(
		(feature) => feature.id === 'tracking'
	);

	return (
		<div className={styles.container}>
			{/* Banner with clickable logo - Pass onLogoClick */}
			<Banner onLogoClick={onLogoClick} />

			{/* Page Title below banner */}
			<PageTitle
				icon={trackingFeature.icon}
				title={trackingFeature.title}
				color={trackingFeature.color}
			/>
		</div>
	);
};

export default TrackingPage;
