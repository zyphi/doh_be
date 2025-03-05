export interface IRecipe {
	name: string;
	isPublic: boolean;
	ballsNumber: number;
	ballsWeight: number;
	hydration: number;
	yeastPerKg: number;
	saltPerKg: number;
	fatPerKg: number;
	doughs: IDough[];
	userId: string;
	notes: string;
	_id: string;
	photos: string[];
	startTime: number;
	totalTime: number;
}

export interface IStoredRecipe extends IRecipe {
	_id: string;
}

export interface IFlour {
	isMainFlour: boolean;
	name: string;
	percentage: number;
	_id: string;
}

export interface IDoughFlour extends Omit<IFlour, 'percentage'> {
	amount: number;
}

export interface IExtra {
	name: string;
	amount: number;
	unit: string;
	_id: string;
}

export interface IRecipeIngredients {
	flour: number;
	water: number;
	yeast: number;
	salt: number;
	fat: number;
}

export interface IDoughIngredients {
	isMainDough: boolean;
	totalFlour: number;
	water: number;
	yeast: number;
	salt: number;
	fat: number;
	flours: IDoughFlour[];
	name: string;
	totalWeight: number;
	_id: string;
	isEmpty: boolean;
}

export interface IDough extends IDoughPercentages {
	isMainDough: boolean;
	name: string;
	flours: IFlour[];
	extras: IExtra[];
	childrenDoughs: string[];
	_id: string;
	events: IEvent[];
}

export interface IDoughPercentages {
	flourPercentage: number;
	waterPercentage: number;
	yeastPercentage: number;
	saltPercentage: number;
	fatPercentage: number;
}

export interface IEvent {
	_id: string;
	type: EventType;
	temperatureBelow: number;
	temperatureAbove: number;
	name: string;
	notes: string;
	time: number;
}

export type EventType = 'kneading' | 'action' | 'baking';

export interface IParsedEvent {
	time: number;
	events: IEventWithDoughId[];
}

export type IEventWithDoughId = IEvent & {
	doughId: string;
	parentDoughId: string | null;
};
