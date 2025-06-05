// eCare-PD Color Palette
export const colors = {
	primary: '#4F6ED4',
	primaryDark: '#263B7F',
	mint: '#CCE9E4',
	peach: '#FFB3A8',
	coral: '#DE6957',

	// Semantic colors
	text: {
		primary: '#263B7F',
		secondary: '#4F6ED4',
		muted: '#6B7280',
	},

	background: {
		primary: '#FFFFFF',
		gradient: 'linear-gradient(135deg, #F3F4F6 0%, #E5F3F0 100%)',
		welcome: 'linear-gradient(135deg, #F0F4FF 0%, #E5F3F0 100%)',
	},

	border: {
		light: '#E5E7EB',
		medium: '#D1D5DB',
	},

	shadow: {
		sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
		lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
		xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
	},
};

// Function to create colored shadows
export const createColoredShadow = (color, opacity = 0.3) => {
	const opacityHex = Math.round(opacity * 255)
		.toString(16)
		.padStart(2, '0');
	return `0 8px 25px -5px ${color}${opacityHex}, 0 10px 10px -5px ${color}20`;
};

export default colors;
