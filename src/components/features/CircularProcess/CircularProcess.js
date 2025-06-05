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

					{/* Connecting lines and arrows - FIXED: Adjusted for smaller container */}
					<svg className={styles.connectionLines} viewBox='0 0 420 320'>
						{/* Main circle - FIXED: Centered and sized for smaller container */}
						<circle
							cx='210'
							cy='160'
							r='70' /* FIXED: Smaller radius for compact layout */
							fill='none'
							stroke='#4ade80'
							strokeWidth='3'
							strokeDasharray='4,2'
							className={styles.animatedCircle}
						/>

						{/* Directional arrows */}
						{[0, 1, 2, 3].map((index) => {
							const cardinalAngles = [-90, 0, 90, 180];
							const angle = cardinalAngles[index] - 45; // Offset for arrow direction
							const radian = (angle * Math.PI) / 180;
							const x = 210 + Math.cos(radian) * 60; // FIXED: Adjusted for new center and radius
							const y = 160 + Math.sin(radian) * 60;
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

					{/* Feature nodes with text - FIXED: Better positioning calculations */}
					<div className={styles.featuresContainer}>
						{appFeatures.map((feature, index) => {
							// FIXED: Position at exact cardinal directions
							const cardinalAngles = [-90, 0, 90, 180]; // Goals, Tracking, Journey, Resources
							const angle = cardinalAngles[index];
							const radian = (angle * Math.PI) / 180;

							// FIXED: Different distances for horizontal vs vertical positioning
							const circleRadius = 70; // Circle radius (matches SVG)

							// FIXED: More distance for left/right cards, less for top/bottom
							const horizontalCardDistance = 240; // FIXED: More space for Resources & Tracking
							const verticalCardDistance = 160; // FIXED: Optimal space for Goals & Journey

							// Determine if this is a horizontal or vertical position
							const isHorizontal = index === 1 || index === 3; // Tracking (0°) or Resources (180°)
							const cardDistance = isHorizontal
								? horizontalCardDistance
								: verticalCardDistance;

							// Base container dimensions (matching CSS)
							const containerWidth = 420;
							const containerHeight = 320;

							// Calculate positions relative to container center
							const nodeXPercent =
								50 + (Math.cos(radian) * circleRadius * 100) / containerWidth;
							const nodeYPercent =
								50 + (Math.sin(radian) * circleRadius * 100) / containerHeight;

							const textXPercent =
								50 + (Math.cos(radian) * cardDistance * 100) / containerWidth;
							const textYPercent =
								50 + (Math.sin(radian) * cardDistance * 100) / containerHeight;

							return (
								<div key={feature.id}>
									{/* Feature node - FIXED: Better positioning */}
									<div
										className={styles.featureNode}
										style={{
											left: `${nodeXPercent}%`,
											top: `${nodeYPercent}%`,
										}}
									>
										<div
											className={styles.featureNodeIcon}
											style={{ backgroundColor: feature.color }}
										>
											<feature.icon size={24} color='white' />
											{/* Step number */}
											<div
												className={styles.stepNumber}
												style={{ color: feature.color }}
											>
												{feature.number}
											</div>
										</div>
									</div>

									{/* Feature text - FIXED: Much further from center */}
									<div
										className={styles.featureText}
										style={{
											left: `${textXPercent}%`,
											top: `${textYPercent}%`,
										}}
									>
										<FeatureCard
											feature={feature}
											className={styles.centeredCard}
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
