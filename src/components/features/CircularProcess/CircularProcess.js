import React from 'react';
import FeatureCard from '../../ui/FeatureCard';
import { appFeatures } from '../../../constants/features';
import { colors } from '../../../constants/colors';
import styles from './CircularProcess.module.css';

const CircularProcess = ({ onFeatureClick }) => {
	return (
		<div className={styles.container}>
			{/* Mobile-first: Vertical layout for small screens */}
			<div className={styles.mobileLayout}>
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

			{/* Desktop/Tablet: Circular layout for larger screens */}
			<div className={styles.desktopLayout}>
				<div className={styles.circularContainer}>
					{/* Central hub */}
					<div className={styles.centralHub}>
						<div
							className={styles.centralHubContent}
							style={{ backgroundColor: colors.mint }}
						>
							<div className={styles.centralText}>
								<div className={styles.centralTextLine}>Your Care</div>
								<div className={styles.centralTextLine}>Journey</div>
							</div>
						</div>
					</div>

					{/* Connecting lines and arrows */}
					<svg className={styles.connectionLines} viewBox='0 0 500 400'>
						{/* Main circle - FIXED: Even larger viewBox for no overlap */}
						<circle
							cx='250'
							cy='200'
							r='90'
							fill='none'
							stroke={colors.mint}
							strokeWidth='2'
							strokeDasharray='4,2'
							className={styles.animatedCircle}
						/>

						{/* Directional arrows - FIXED: Positioned on circle edge */}
						{[0, 1, 2, 3].map((index) => {
							const angle = index * 90 - 45;
							const radian = (angle * Math.PI) / 180;
							const x = 250 + Math.cos(radian) * 77;
							const y = 200 + Math.sin(radian) * 77;
							const rotation = angle + 90;

							return (
								<g key={index}>
									<polygon
										points='0,-6 4,0 0,6 -1,0'
										fill={colors.primary}
										transform={`translate(${x},${y}) rotate(${rotation})`}
										opacity='0.7'
									/>
								</g>
							);
						})}
					</svg>

					{/* Feature nodes with text */}
					<div className={styles.featuresContainer}>
						{appFeatures.map((feature, index) => {
							const angle = index * 90 - 90; // Start from top
							const radian = (angle * Math.PI) / 180;

							// FIXED: Much larger distances to ensure no overlap
							const baseNodeRadius = 90; // Nodes on the circle
							const baseTextRadius = 200; // FIXED: Much further out - no overlap possible

							// Node position
							const nodeX = Math.cos(radian) * baseNodeRadius;
							const nodeY = Math.sin(radian) * baseNodeRadius;

							// Text position (very far from circle and nodes)
							const textX = Math.cos(radian) * baseTextRadius;
							const textY = Math.sin(radian) * baseTextRadius;

							return (
								<div key={feature.id}>
									{/* Feature node */}
									<div
										className={styles.featureNode}
										style={{
											left: `calc(50% + ${nodeX}px)`,
											top: `calc(50% + ${nodeY}px)`,
										}}
									>
										<div
											className={styles.featureNodeIcon}
											style={{ backgroundColor: feature.color }}
										>
											<feature.icon size={16} color='white' />
											{/* Step number */}
											<div
												className={styles.stepNumber}
												style={{ color: feature.color }}
											>
												{feature.number}
											</div>
										</div>
									</div>

									{/* Feature text using reusable component */}
									<div
										className={styles.featureText}
										style={{
											left: `calc(50% + ${textX}px)`,
											top: `calc(50% + ${textY}px)`,
										}}
									>
										<FeatureCard
											feature={feature}
											className={
												index % 2 === 0 ? styles.textLeft : styles.textRight
											}
											onClick={onFeatureClick}
											interactive={!!onFeatureClick}
										/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CircularProcess;
