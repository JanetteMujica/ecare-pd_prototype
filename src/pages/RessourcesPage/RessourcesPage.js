import React from 'react';
import { Lightbulb } from 'lucide-react';
import Banner from '../../components/layout/Banner';
import PageTitle from '../../components/layout/PageTitle';
import { colors } from '../../constants/colors';
import { appFeatures } from '../../constants/features';
import styles from './RessourcesPage.module.css';

const RessourcesPage = ({ onLogoClick }) => {
	// ADD: Accept onLogoClick prop
	// Get the resources feature data for consistent styling
	const resourcesFeature = appFeatures.find(
		(feature) => feature.id === 'resources'
	);

	return (
		<div className={styles.container}>
			{/* Banner with clickable logo - Pass onLogoClick */}
			<Banner onLogoClick={onLogoClick} />

			{/* Page Title below banner */}
			<PageTitle
				icon={resourcesFeature.icon}
				title={resourcesFeature.title}
				color={resourcesFeature.color}
			/>
		</div>
	);
};

export default RessourcesPage;
