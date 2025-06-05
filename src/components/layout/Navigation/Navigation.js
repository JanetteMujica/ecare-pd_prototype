import React from 'react';
import { navigationItems } from '../../../constants/features';
import { colors } from '../../../constants/colors';
import styles from './Navigation.module.css';

const Navigation = ({ currentPage, onNavigate }) => {
	return (
		<nav className={styles.navigation}>
			<div className={styles.container}>
				{navigationItems.map(({ id, icon: Icon, label, color }) => (
					<button
						key={id}
						onClick={() => onNavigate(id)}
						className={`${styles.navButton} ${
							currentPage === id ? styles.active : ''
						}`}
						style={{
							backgroundColor: currentPage === id ? color : 'transparent',
							color: currentPage === id ? 'white' : '#6B7280',
						}}
						aria-label={`Navigate to ${label}`}
					>
						<Icon size={24} />
						<span className={styles.label}>{label}</span>
					</button>
				))}
			</div>
		</nav>
	);
};

export default Navigation;
