import { IEvent, IStoredRecipe } from '#types/types.recipes';

export const defaultRecipe: IStoredRecipe = {
	_id: '_default',
	name: 'Default Recipe',
	isPublic: false,
	ballsNumber: 1,
	ballsWeight: 250,
	hydration: 60,
	yeastPerKg: 4,
	saltPerKg: 30,
	fatPerKg: 0,
	notes: '',
	doughs: [
		{
			isMainDough: true,
			name: 'Main Dough',
			flourPercentage: 100,
			waterPercentage: 100,
			yeastPercentage: 100,
			saltPercentage: 100,
			fatPercentage: 100,
			extras: [],
			flours: [
				{
					isMainFlour: true,
					name: 'Flour',
					percentage: 100,
					_id: '_mainflour'
				}
			],
			childrenDoughs: [],
			_id: '_maindough',
			events: [
				{
					_id: '_mainkneading',
					type: 'kneading',
					temperatureBelow: 24,
					temperatureAbove: 24,
					name: 'Main Dough',
					notes: '',
					time: 0
				},
				{
					_id: '_mainaction',
					type: 'action',
					temperatureBelow: 24,
					temperatureAbove: 24,
					name: 'Portioning',
					notes: '',
					time: 1230
				},
				{
					_id: '_defaultbaking',
					type: 'baking',
					temperatureBelow: 450,
					temperatureAbove: 450,
					name: 'Baking',
					notes: '',
					time: 1440
				}
			]
		}
	],
	userId: '_creator',
	photos: [],
	startTime: 1200,
	totalTime: 1440
};
