import { model, Schema } from 'mongoose';

import { IRecipe, IDough, IExtra, IFlour, IEvent } from '#types/types.recipes';

import { normalizeDocument } from '../index.core';

Schema.Types.String.checkRequired(v => typeof v === 'string');

const EventSchema = new Schema<IEvent>(
	{
		name: {
			type: String,
			required: true
		},
		_id: {
			type: String,
			required: true
		},
		notes: {
			type: String,
			required: true
		},
		temperatureBelow: {
			type: Number,
			required: true
		},
		temperatureAbove: {
			type: Number,
			required: true
		},
		time: {
			type: Number,
			required: true
		},
		type: {
			type: String,
			required: true
		}
	},
	{ _id: false }
);

const FlourSchema = new Schema<IFlour>(
	{
		name: {
			type: String,
			required: true
		},
		percentage: {
			type: Number,
			required: true
		},
		isMainFlour: {
			type: Boolean,
			required: true
		},
		_id: {
			type: String,
			required: true
		}
	},
	{ _id: false }
);

const ExtraSchema = new Schema<IExtra>(
	{
		name: {
			type: String,
			required: true
		},
		amount: {
			type: Number,
			required: true
		},
		unit: {
			type: String,
			required: true
		},
		_id: {
			type: String,
			required: true
		}
	},
	{ _id: false }
);

const DoughSchema = new Schema<IDough>(
	{
		name: {
			type: String,
			required: true
		},
		isMainDough: {
			type: Boolean,
			required: true
		},
		flourPercentage: {
			type: Number,
			required: true
		},
		waterPercentage: {
			type: Number,
			required: true
		},
		yeastPercentage: {
			type: Number,
			required: true
		},
		saltPercentage: {
			type: Number,
			required: true
		},
		fatPercentage: {
			type: Number,
			required: true
		},
		extras: {
			type: [ExtraSchema],
			required: true
		},
		flours: {
			type: [FlourSchema],
			required: true
		},
		_id: {
			type: String,
			required: true
		},
		childrenDoughs: {
			type: [String],
			required: true
		},
		events: {
			type: [EventSchema],
			required: true
		}
	},
	{ _id: false }
);

const RecipeSchema = new Schema<IRecipe>({
	name: {
		type: String,
		required: true
	},
	isPublic: {
		type: Boolean,
		required: true
	},
	ballsNumber: {
		type: Number,
		required: true
	},
	ballsWeight: {
		type: Number,
		required: true
	},
	hydration: {
		type: Number,
		required: true
	},
	yeastPerKg: {
		type: Number,
		required: true
	},
	saltPerKg: {
		type: Number,
		required: true
	},
	fatPerKg: {
		type: Number,
		required: true
	},
	doughs: {
		type: [DoughSchema],
		required: true
	},
	userId: {
		type: String,
		required: true
	},
	notes: {
		type: String,
		required: true
	},
	photos: {
		type: [String],
		required: true
	},
	startTime: {
		type: Number,
		required: true
	},
	totalTime: {
		type: Number,
		required: true
	}
});

const Recipe = model<IRecipe>('Recipe', RecipeSchema);

export const coreCreateRecipe = async (newRecipe: Omit<IRecipe, '_id'>) => {
	try {
		return normalizeDocument(await Recipe.create(newRecipe));
	} catch (_) {
		console.error('Failed to create recipe', _);
		return null;
	}
};

export const coreGetUserRecipes = async (userId: string) => {
	return (await Recipe.find({ userId })).map(recipe =>
		normalizeDocument(recipe)
	);
};

export const coreGetSharedRecipes = async (userId: string) => {
	return (
		await Recipe.find({
			isPublic: true,
			userId: { $ne: userId }
		})
	).map(recipe => normalizeDocument(recipe));
};

export const coreGetRecipe = async (recipeId: string) => {
	const recipe = await Recipe.findById(recipeId);
	return recipe ? normalizeDocument(recipe) : null;
};

export const coreUpdateRecipe = async (
	recipeId: string,
	updatedRecipe: IRecipe
) => {
	await Recipe.updateOne({ _id: recipeId }, updatedRecipe);
	const storedRecipe = await Recipe.findById(recipeId);
	return storedRecipe ? normalizeDocument(storedRecipe) : null;
};

export const coreDeleteRecipe = async (recipeId: string) => {
	const deleteResult = await Recipe.deleteOne({ _id: recipeId });
	return deleteResult.deletedCount > 0;
};
