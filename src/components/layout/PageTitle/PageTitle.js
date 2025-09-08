import React from 'react';
import styles from './PageTitle.module.css';

const PageTitle = ({ icon: Icon, title, color, className = '' }) => {
	const iconStyles = {
		backgroundColor: color,
	};

	const titleStyles = {
		color: color,
	};

	return (
		<div className={`${styles.container} ${className}`}>
			<div className={styles.content}>
				<div className={styles.titleSection}>
					<div className={styles.iconContainer} style={iconStyles}>
						<Icon size={24} color='white' />
					</div>
					<h1 className={styles.title} style={titleStyles}>
						{title}
					</h1>
				</div>
			</div>
		</div>
	);
};

export default PageTitle;
