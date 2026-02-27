import {useState} from 'react';

export type NavRoute =
	| 'cover'
	| 'economic-survey'
	| 'meal-selection'
	| 'meal-manager';

export type NavigationState = {
	currentRoute: NavRoute;
	navigate: (route: NavRoute) => void;
	goBack: () => void;
};

/**
 * 統一的導航 Hook，管理應用內的路由狀態
 */
export function useNavigation(): NavigationState {
	const [routeHistory, setRouteHistory] = useState<NavRoute[]>(['cover']);

	const currentRoute: NavRoute =
		routeHistory[routeHistory.length - 1] ?? 'cover';

	const navigate = (route: NavRoute) => {
		setRouteHistory(previous => [...previous, route]);
	};

	const goBack = () => {
		setRouteHistory(previous => {
			if (previous.length > 1) {
				return previous.slice(0, -1);
			}

			// If at the first route, go back to cover
			return ['cover'];
		});
	};

	return {
		currentRoute,
		navigate,
		goBack,
	};
}
