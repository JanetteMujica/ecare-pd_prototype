import React from 'react';
import { Map } from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import { colors } from '../../constants/colors';
import { appFeatures } from '../../constants/features';
import styles from './JourneyPage.module.css';

const JourneyPage = ({ onLogoClick }) => {
	// ADD: Accept onLogoClick prop
	// Get the journey feature data for consistent styling
	const journeyFeature = appFeatures.find(
		(feature) => feature.id === 'journey'
	);

	return (
		<div className={styles.container}>
			<Banner onLogoClick={onLogoClick} />
			<PageTitle
				icon={journeyFeature.icon}
				title={journeyFeature.title}
				color={journeyFeature.color}
			/>
		</div>
	);
};

export default JourneyPage;
