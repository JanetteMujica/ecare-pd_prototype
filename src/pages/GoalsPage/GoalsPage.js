import React from 'react';
import { Target } from 'lucide-react';
import PlaceholderPage from '../PlaceholderPage';

const GoalsPage = ({ onStartGoalSetting }) => {
	return (
		<PlaceholderPage
			title='Goals'
			icon={Target}
			description="Set and manage your personal health goals with CAFY's guidance."
			actionButton={{
				text: 'Start Goal Setting with CAFY',
				onClick: onStartGoalSetting,
			}}
		/>
	);
};

export default GoalsPage;
