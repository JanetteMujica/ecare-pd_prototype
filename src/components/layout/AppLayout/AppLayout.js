import React from 'react';
import styles from './AppLayout.module.css';

const AppLayout = ({ children }) => {
	return (
		<div className={styles.layout}>
			{/* Mobile Layout */}
			<div className={styles.mobileLayout}>{children}</div>

			{/* Desktop Layout */}
			<div className={styles.desktopLayout}>{children}</div>
		</div>
	);
};

export default AppLayout;
