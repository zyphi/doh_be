import { IRecipe } from '#types/types.recipes';
import {
	coreCreateRecipe,
	coreDeleteRecipe,
	coreGetUserRecipes,
	coreGetRecipe,
	coreUpdateRecipe,
	coreGetSharedRecipes
} from './core/index.core';

export const getUserRecipes = async (userId: string) => {
	return await coreGetUserRecipes(userId);
};

export const getSharedRecipes = async (userId: string) => {
	return await coreGetSharedRecipes(userId);
};

export const createRecipe = async (recipe: Omit<IRecipe, '_id'>) => {
	return await coreCreateRecipe(recipe);
};

export const getRecipeById = async (recipeId: string) => {
	return await coreGetRecipe(recipeId);
};

export const updateRecipe = async (
	recipeId: string,
	updatedRecipe: IRecipe
) => {
	return await coreUpdateRecipe(recipeId, updatedRecipe);
};

export const deleteRecipe = async (recipeId: string) => {
	return coreDeleteRecipe(recipeId);
};
