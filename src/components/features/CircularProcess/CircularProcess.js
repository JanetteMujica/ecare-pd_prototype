import React from 'react';
import FeatureCard from '../../ui/FeatureCard';
import { appFeatures } from '../../../constants/features';
import styles from './CircularProcess.module.css';

const CircularProcess = ({ onFeatureClick }) => {
	return (
		<div className={styles.container}>
			{/* Unified vertical layout for all screen sizes */}
			<div className={styles.verticalLayout}>
				{appFeatures.map((feature) => (
					<FeatureCard
						key={feature.id}
						feature={feature}
						vertical={true}
						onClick={onFeatureClick}
						interactive={!!onFeatureClick}
					/>
				))}
			</div>
		</div>
	);
};

export default CircularProcess;
