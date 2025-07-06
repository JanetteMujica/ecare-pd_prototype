import React from 'react';
import styles from './PlaceholderPage.module.css';

const PlaceholderPage = ({ title, icon: Icon, description }) => {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				{Icon && (
					<div className={styles.iconContainer}>
						<Icon size={64} className={styles.icon} />
					</div>
				)}
				<h1 className={styles.heading}>{title}</h1>
				<p className={styles.description}>{description}</p>
			</div>
		</div>
	);
};

export default PlaceholderPage;