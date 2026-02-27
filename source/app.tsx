import React from 'react';
import {useApp, useInput} from 'ink';
import Cover from './components/cover.js';
import EconomicSurvey from './components/economic-survey.js';
import MealOptionsManager from './components/meal-options-manager.js';
import {useNavigation} from './hooks/use-navigation.js';

export default function App(): JSX.Element {
	const {currentRoute, navigate} = useNavigation();
	const {exit} = useApp();

	useInput(
		(input, key) => {
			if (input === 'q') {
				exit();
			} else if (key.return && currentRoute === 'cover') {
				navigate('economic-survey');
			} else if (input === 'm' && currentRoute === 'cover') {
				navigate('meal-manager');
			}
		},
		{
			isActive: currentRoute === 'cover',
		},
	);

	switch (currentRoute) {
		case 'economic-survey': {
			return <EconomicSurvey />;
		}

		case 'meal-manager': {
			return <MealOptionsManager />;
		}

		default: {
			return <Cover />;
		}
	}
}
