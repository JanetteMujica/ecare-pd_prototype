// Synthetic tracking data for demo purposes
// This simulates real tracking data that would come from the TrackingPage

// Helper function to generate realistic tracking data with variations
const generateTrackingData = (
	startDate,
	endDate,
	baselineScore = 3,
	volatility = 1
) => {
	const data = [];
	const start = new Date(startDate);
	const end = new Date(endDate);
	const dayDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

	let currentScore = baselineScore;

	for (let i = 0; i <= dayDiff; i++) {
		const date = new Date(start);
		date.setDate(start.getDate() + i);

		// Add some realistic variation
		const randomChange = (Math.random() - 0.5) * volatility;
		currentScore = Math.max(1, Math.min(5, currentScore + randomChange));

		// Add some weekly patterns (slightly better on weekends for some conditions)
		const dayOfWeek = date.getDay();
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			currentScore = Math.min(5, currentScore + 0.2);
		}

		data.push({
			date: date.toISOString().split('T')[0],
			score: Math.round(currentScore * 10) / 10, // Round to 1 decimal
			rawScore: Math.round(currentScore),
		});
	}

	return data;
};

// Get date ranges for different periods
const getDateRange = (period) => {
	const today = new Date();
	let startDate;

	switch (period) {
		case 'This Week':
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 7);
			break;
		case 'This Month':
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 30);
			break;
		case '6 Months':
			startDate = new Date(today);
			startDate.setMonth(today.getMonth() - 6);
			break;
		default:
			startDate = new Date(today);
			startDate.setDate(today.getDate() - 7);
	}

	return {
		startDate: startDate.toISOString().split('T')[0],
		endDate: today.toISOString().split('T')[0],
	};
};

// Define tracking options from taxonomy with user-friendly names
export const trackingOptions = [
	// Physical Health - Moving & Walking
	{ id: 'tremor', name: 'Tremor', category: 'Movement' },
	{ id: 'bradykinesia', name: 'Slow Movement', category: 'Movement' },
	{ id: 'balance', name: 'Balance', category: 'Movement' },
	{ id: 'freezing', name: 'Gait Freezing', category: 'Movement' },

	// Physical Health - Body Reactions & Pain
	{ id: 'pain', name: 'Pain', category: 'Physical Comfort' },
	{ id: 'light_headedness', name: 'Dizziness', category: 'Physical Comfort' },
	{
		id: 'unusual_sweating',
		name: 'Sweating Issues',
		category: 'Physical Comfort',
	},
	{ id: 'skin_changes', name: 'Skin Changes', category: 'Physical Comfort' },

	// Physical Health - Saliva & Swallowing
	{ id: 'drooling', name: 'Drooling', category: 'Swallowing' },
	{ id: 'swallowing', name: 'Swallowing Difficulty', category: 'Swallowing' },

	// Physical Health - Bowel & Bladder
	{ id: 'constipation', name: 'Constipation', category: 'Digestive' },
	{ id: 'urinary_issues', name: 'Urinary Issues', category: 'Digestive' },

	// Physical Health - Sleep & Fatigue
	{ id: 'insomnia', name: 'Sleep Problems', category: 'Sleep & Energy' },
	{
		id: 'daytime_sleepiness',
		name: 'Daytime Sleepiness',
		category: 'Sleep & Energy',
	},
	{ id: 'fatigue', name: 'Fatigue', category: 'Sleep & Energy' },
	{ id: 'restless_legs', name: 'Restless Legs', category: 'Sleep & Energy' },

	// Physical Health - Sensory & Voice
	{ id: 'vision_problems', name: 'Vision Problems', category: 'Sensory' },
	{ id: 'smell_loss', name: 'Smell Loss', category: 'Sensory' },
	{ id: 'taste_loss', name: 'Taste Loss', category: 'Sensory' },
	{
		id: 'abnormal_sensations',
		name: 'Abnormal Sensations',
		category: 'Sensory',
	},
	{ id: 'speech_problems', name: 'Speech Problems', category: 'Sensory' },

	// Lifestyle
	{ id: 'physical_activity', name: 'Physical Activity', category: 'Lifestyle' },
	{ id: 'hobbies', name: 'Hobbies & Interests', category: 'Lifestyle' },
	{ id: 'living_connected', name: 'Social Connection', category: 'Lifestyle' },
	{ id: 'leisure', name: 'Leisure Activities', category: 'Lifestyle' },

	// Mental Health
	{ id: 'panic_attack', name: 'Anxiety & Panic', category: 'Mental Health' },
	{ id: 'emotional_changes', name: 'Mood Changes', category: 'Mental Health' },
	{ id: 'forgetfulness', name: 'Memory Issues', category: 'Mental Health' },
	{ id: 'mental_overload', name: 'Mental Overload', category: 'Mental Health' },
	{ id: 'brain_fog', name: 'Brain Fog', category: 'Mental Health' },

	// Medication
	{
		id: 'medication_adherence',
		name: 'Medication Routine',
		category: 'Medication',
	},
	{ id: 'side_effects', name: 'Side Effects', category: 'Medication' },

	// Wellbeing
	{ id: 'nutrition', name: 'Nutrition & Diet', category: 'Wellbeing' },
	{ id: 'daily_living', name: 'Daily Activities', category: 'Wellbeing' },
	{ id: 'physical_safety', name: 'Physical Safety', category: 'Wellbeing' },
];

// Generate synthetic data for each tracking option
export const generateSyntheticData = (period) => {
	const { startDate, endDate } = getDateRange(period);
	const syntheticData = {};

	trackingOptions.forEach((option) => {
		// Create different patterns for different types of conditions
		let baseline, volatility;

		switch (option.category) {
			case 'Movement':
				baseline = 2.8; // Slightly below average
				volatility = 0.8;
				break;
			case 'Physical Comfort':
				baseline = 2.5; // More challenging
				volatility = 1.2;
				break;
			case 'Sleep & Energy':
				baseline = 3.2; // Variable
				volatility = 1.0;
				break;
			case 'Mental Health':
				baseline = 3.5; // Generally better managed
				volatility = 0.9;
				break;
			case 'Lifestyle':
				baseline = 3.8; // More controllable
				volatility = 0.6;
				break;
			case 'Medication':
				baseline = 4.0; // Well managed
				volatility = 0.4;
				break;
			case 'Wellbeing':
				baseline = 3.6; // Generally good
				volatility = 0.7;
				break;
			default:
				baseline = 3.0;
				volatility = 0.8;
		}

		syntheticData[option.id] = generateTrackingData(
			startDate,
			endDate,
			baseline,
			volatility
		);
	});

	return syntheticData;
};

// Get data for a specific tracking option and period
export const getTrackingData = (trackingId, period) => {
	const allData = generateSyntheticData(period);
	return allData[trackingId] || [];
};

// Get comparison data for two tracking options
export const getComparisonData = (tracking1Id, tracking2Id, period) => {
	const data1 = getTrackingData(tracking1Id, period);
	const data2 = getTrackingData(tracking2Id, period);

	return {
		tracking1: data1,
		tracking2: data2,
		dates: data1.map((item) => item.date),
	};
};
