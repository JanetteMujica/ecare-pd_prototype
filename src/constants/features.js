import {
	Lightbulb,
	Sailboat,
	ShipWheel,
	Telescope,
	Sparkles,
	Wind,
} from 'lucide-react';
import { colors } from './colors';

// Main app features for circular process and navigation
export const appFeatures = [
	{
		id: 'goals',
		icon: ShipWheel,
		title: 'Goals',
		desc: 'Set your self-care goals',
		color: colors.coral,
		number: '1',
		path: '/goals',
	},
	{
		id: 'tracking',
		icon: Telescope,
		title: 'Tracking',
		desc: 'Keep track of your self-care',
		color: colors.primary,
		number: '2',
		path: '/tracking',
	},
	{
		id: 'journey',
		icon: Sailboat,
		title: 'Journey',
		desc: 'See your journey over time',
		color: colors.primaryDark,
		number: '3',
		path: '/journey',
	},
	{
		id: 'resources',
		icon: Wind,
		title: 'Ressources',
		desc: 'Get helpful care-tips & trusted resources',
		color: colors.peach,
		number: '4',
		path: '/resources',
	},
];

// Navigation items (same as features but formatted for nav)
export const navigationItems = appFeatures.map((feature) => ({
	id: feature.id,
	icon: feature.icon,
	label: feature.title,
	color: feature.color,
	path: feature.path,
}));

// App content for pages
export const appContent = {
	welcome: {
		title: 'Track what matters. <br>Take care of yourself, your way.',
		subtitle: "Your companion for living well with Parkinson's",
		description:
			"Living with Parkinson's has its challenges, but you don't have to face them alone. eCARE-PD helps you stay active in your care, one step at a time. Together, we'll set goals, track your health, and offer support that's tailored to your experience.",
		ctaText: 'Start today by focusing on what matters most to you',
		cta: 'Begin Your Self-Care Journey',
	},

	cafy: {
		greeting:
			"Hi, I'm CAFY ! I help you navigate Parkinson's, one day at a time.",
		description:
			"Your Parkinson's journey is unique, I can guide you in identifying what matters the most to you.",
		cta: 'Set self-care goals with CAFY',
		cta2: 'Select self-care goals with a list',
	},
};

export default appFeatures;
