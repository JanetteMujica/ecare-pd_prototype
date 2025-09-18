// Synthetic tracking data tailored for Allison Johnson's story
// Recently diagnosed teacher managing fatigue, sleep disturbance, and constipation

// Helper function to generate realistic tracking data with variations based on Allison's specific patterns
const generateTrackingData = (
	startDate,
	endDate,
	baselineScore = 3,
	volatility = 1,
	specificPatterns = {}
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

		// Add Allison-specific patterns
		const dayOfWeek = date.getDay();

		// Allison's specific patterns as a teacher
		if (specificPatterns.teacherPattern) {
			// Monday blues and Friday relief pattern
			if (dayOfWeek === 1) currentScore = Math.max(1, currentScore - 0.3); // Monday
			if (dayOfWeek === 5) currentScore = Math.min(5, currentScore + 0.2); // Friday
			// Weekends slightly better for most symptoms
			if (dayOfWeek === 0 || dayOfWeek === 6) {
				currentScore = Math.min(5, currentScore + 0.3);
			}
		}

		// Sleep-related patterns (worse at beginning of week, medication adjustments)
		if (specificPatterns.sleepPattern) {
			// Recent medication timing changes showing gradual improvement
			const progressFactor = i / dayDiff; // Gets better over time
			currentScore = Math.min(5, currentScore + progressFactor * 0.4);
		}

		// Fatigue patterns (afternoon crashes, seasonal effects)
		if (specificPatterns.fatiguePattern) {
			// Teaching schedule impact - more fatigue during school days
			if (dayOfWeek >= 1 && dayOfWeek <= 5) {
				currentScore = Math.max(1, currentScore - 0.4);
			}
		}

		// Medication adherence patterns (getting better with routine)
		if (specificPatterns.medicationPattern) {
			// Improving adherence over time as routine establishes
			const adherenceImprovement = Math.min(0.6, (i / dayDiff) * 0.6);
			currentScore = Math.min(5, currentScore + adherenceImprovement);
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

// Generate synthetic data for each tracking option tailored to Allison's experience
export const generateSyntheticData = (period) => {
	const { startDate, endDate } = getDateRange(period);
	const syntheticData = {};

	trackingOptions.forEach((option) => {
		// Create different patterns based on Allison's specific conditions
		let baseline, volatility, patterns;

		switch (option.id) {
			// Allison's primary symptoms - more challenging
			case 'fatigue':
				baseline = 2.2; // Major challenge for her
				volatility = 1.0;
				patterns = { teacherPattern: true, fatiguePattern: true };
				break;
			case 'insomnia':
				baseline = 2.4; // Another major issue
				volatility = 1.1;
				patterns = { sleepPattern: true, teacherPattern: true };
				break;
			case 'constipation':
				baseline = 2.3; // Third major symptom
				volatility = 0.8;
				patterns = { teacherPattern: true };
				break;

			// Medication-related (she's learning to manage)
			case 'medication_adherence':
				baseline = 3.7; // Good but improving
				volatility = 0.5;
				patterns = { medicationPattern: true };
				break;
			case 'side_effects':
				baseline = 2.8; // Managing but aware
				volatility = 0.9;
				patterns = { medicationPattern: true };
				break;

			// Movement symptoms (mild for her early stage)
			case 'tremor':
				baseline = 3.8; // Mild tremor, mainly noticed during specific tasks
				volatility = 0.6;
				patterns = { teacherPattern: true };
				break;
			case 'balance':
				baseline = 3.5; // Generally good balance
				volatility = 0.7;
				patterns = { teacherPattern: true };
				break;

			// Work-related lifestyle factors
			case 'physical_activity':
				baseline = 3.2; // Trying to maintain activity
				volatility = 0.8;
				patterns = { teacherPattern: true };
				break;
			case 'daily_living':
				baseline = 3.6; // Managing well but with effort
				volatility = 0.6;
				patterns = { teacherPattern: true };
				break;

			// Mental/emotional (dealing with recent diagnosis)
			case 'emotional_changes':
				baseline = 3.1; // Some ups and downs adjusting to diagnosis
				volatility = 0.9;
				patterns = { teacherPattern: true };
				break;
			case 'brain_fog':
				baseline = 2.9; // Noticeable during demanding teaching periods
				volatility = 0.8;
				patterns = { teacherPattern: true, fatiguePattern: true };
				break;

			// Social connections (important to her)
			case 'living_connected':
				baseline = 3.8; // Good social support
				volatility = 0.5;
				patterns = { teacherPattern: true };
				break;

			// Other symptoms (less prominent for her)
			case 'drooling':
				baseline = 4.2; // Minimal issue
				volatility = 0.4;
				patterns = {};
				break;
			case 'speech_problems':
				baseline = 4.0; // Slight concerns during long teaching days
				volatility = 0.5;
				patterns = { teacherPattern: true };
				break;

			// Default patterns for other symptoms
			default:
				switch (option.category) {
					case 'Movement':
						baseline = 3.4; // Early stage, manageable
						volatility = 0.7;
						patterns = { teacherPattern: true };
						break;
					case 'Sleep & Energy':
						baseline = 2.6; // Her major challenge area
						volatility = 1.0;
						patterns = { sleepPattern: true, teacherPattern: true };
						break;
					case 'Mental Health':
						baseline = 3.2; // Adjusting to diagnosis
						volatility = 0.8;
						patterns = { teacherPattern: true };
						break;
					case 'Lifestyle':
						baseline = 3.5; // Working to maintain quality of life
						volatility = 0.6;
						patterns = { teacherPattern: true };
						break;
					case 'Medication':
						baseline = 3.4; // Learning to manage
						volatility = 0.7;
						patterns = { medicationPattern: true };
						break;
					case 'Wellbeing':
						baseline = 3.3; // Focused on maintaining independence
						volatility = 0.7;
						patterns = { teacherPattern: true };
						break;
					default:
						baseline = 3.0;
						volatility = 0.8;
						patterns = {};
				}
		}

		syntheticData[option.id] = generateTrackingData(
			startDate,
			endDate,
			baseline,
			volatility,
			patterns
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
