import React from 'react';
import Button from '../../components/ui/Button';
import styles from './PlaceholderPage.module.css';

const PlaceholderPage = ({ title, icon: Icon, description, actionButton }) => {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.iconContainer}>
					<Icon className={styles.icon} />
				</div>
				<h1 className={styles.title}>{title}</h1>
				<p className={styles.description}>{description}</p>

				{actionButton && (
					<Button
						onClick={actionButton.onClick}
						size='large'
						variant='primary'
						className={styles.actionButton}
					>
						{actionButton.text}
					</Button>
				)}
			</div>
		</div>
	);
};

export default PlaceholderPage;
