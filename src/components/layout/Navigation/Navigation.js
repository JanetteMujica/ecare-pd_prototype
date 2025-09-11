import React from 'react';
import { navigationItems } from '../../../constants/features';
import { CafyLogo } from '../../ui/Logo/LogoPlaceholder';
import { colors } from '../../../constants/colors';
import styles from './Navigation.module.css';

const Navigation = ({ currentPage, onNavigate, onCafyClick }) => {
	return (
		<nav className={styles.navigation}>
			<div className={styles.container}>
				{/* All navigation items + CAFY button in one container */}
				<div className={styles.navGroup}>
					{navigationItems
						.slice(0, 2)
						.map(({ id, icon: Icon, label, color }) => (
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

					{/* CAFY Button - Centered with absolute positioning */}
					<button
						onClick={onCafyClick}
						className={styles.cafyButton}
						aria-label='Open CAFY Assistant'
					>
						<CafyLogo className={styles.cafyLogo} />
					</button>

					{navigationItems.slice(2).map(({ id, icon: Icon, label, color }) => (
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
			</div>
		</nav>
	);
};

export default Navigation;
