import { NextFunction, Request, Response } from 'express';
import { parse } from 'path';

import { IStoredUser } from '#types/types.users';
import { IRecipe, IStoredRecipe } from '#types/types.recipes';

import {
	getV0ValidationCreateRecipe,
	getV0ValidationGetRecipes
} from '#features/validation';
import {
	createRecipe,
	deleteRecipe,
	getRecipeById,
	getSharedRecipes,
	getUserRecipes,
	updateRecipe
} from '#features/database/database.recipes';
import { APIReq, APIRes } from '#types/types.api';
import { defaultRecipe } from '#app/data/defaultRecipe';
import {
	compressPicture,
	deleteFromExternalStorage,
	removeFile,
	uploadRecipePhotos,
	uploadToExternalStorage
} from '#features/fileStorage';

export const v0GetRecipesController = () => {
	return [
		...getV0ValidationGetRecipes(),
		async (req: APIReq, res: APIRes<{ recipes: IStoredRecipe[] }>) => {
			const { nameFilter, getPrivate, getPublic } = req.query;

			const userId = (req.user as IStoredUser)._id;
			const userRecipes =
				getPrivate === 'true' ? await getUserRecipes(userId) : [];

			const sharedRecipes =
				getPublic === 'true' ? await getSharedRecipes(userId) : [];

			res.status(200).json({
				success: true,
				message: 'Successfully fetched recipes',
				data: {
					recipes: [...userRecipes, ...sharedRecipes].filter(r =>
						r.name.includes(nameFilter)
					)
				}
			});
		}
	];
};

export const v0CreateRecipeController = () => {
	return [
		...getV0ValidationCreateRecipe(),
		async (
			req: APIReq<{}, IRecipe>,
			res: APIRes<{ recipe: IStoredRecipe }>,
			next: NextFunction
		) => {
			const newRecipe = req.body;

			const storedRecipe = await createRecipe({
				...newRecipe,
				userId: (req.user as IStoredUser)._id
			});
			if (!storedRecipe) {
				return next({
					message: 'Failed to create recipe',
					statusCode: 500
				});
			}

			res.status(200).json({
				success: true,
				message: 'Successfully created recipe',
				data: { recipe: storedRecipe }
			});
		}
	];
};

export const v0GetRecipeController = () => {
	return [
		async (
			req: APIReq<{ id: string }>,
			res: APIRes<{ recipe: IStoredRecipe }>,
			next: NextFunction
		) => {
			if (req.params.id === '-1') {
				res.status(200).json({
					success: true,
					message: 'Successfully fetched default recipe',
					data: { recipe: defaultRecipe }
				});
				return;
			}

			const storedRecipe = await getRecipeById(req.params.id);

			if (!storedRecipe) {
				return next({
					message: 'Recipe not found',
					statusCode: 404
				});
			}

			res.status(200).json({
				success: true,
				message: 'Successfully fetched recipe',
				data: { recipe: storedRecipe }
			});
		}
	];
};

export const v0UpdateRecipeController = () => {
	return [
		...getV0ValidationCreateRecipe(),
		async (
			req: APIReq<{ id: string }, IRecipe>,
			res: APIRes<{ recipe: IStoredRecipe }>,
			next: NextFunction
		) => {
			const newRecipe = req.body;

			const storedRecipe = await getRecipeById(req.params.id);

			if (!storedRecipe) {
				return next({
					message: 'Recipe not found',
					statusCode: 404
				});
			}

			if ((req.user as IStoredUser)._id !== storedRecipe.userId) {
				return next({
					message: 'Unauthorized',
					statusCode: 401
				});
			}

			const updatedRecipe = await updateRecipe(req.params.id, {
				...newRecipe,
				userId: (req.user as IStoredUser)._id
			});

			if (!updatedRecipe) {
				return next({
					message: 'Failed to update recipe',
					statusCode: 500
				});
			}

			res.status(200).json({
				success: true,
				message: 'Recipe successfully updated',
				data: { recipe: updatedRecipe }
			});
		}
	];
};

export const v0DeleteRecipeController = () => {
	return [
		async (
			req: Request<{ id: string }, {}, IRecipe>,
			res: Response,
			next: NextFunction
		) => {
			const storedRecipe = await getRecipeById(req.params.id);

			if (!storedRecipe) {
				return next({
					message: 'Recipe not found',
					statusCode: 404
				});
			}

			if ((req.user as IStoredUser)._id !== storedRecipe.userId) {
				return next({
					message: 'Unauthorized',
					statusCode: 401
				});
			}

			const deletedRecipe = await deleteRecipe(req.params.id);

			if (!deletedRecipe) {
				return next({
					message: 'Failed to delete recipe',
					statusCode: 500
				});
			}

			res.status(200).json({
				success: true,
				message: 'Recipe successfully deleted',
				data: null
			});
		}
	];
};

export const v0UploadPhotosController = () => {
	return [
		uploadRecipePhotos,
		(req: Request, _: any, next: NextFunction) => {
			if (req.files && Array.isArray(req.files)) {
				req.files.forEach(
					file => compressPicture(file.path) // not awaiting/catching this on purpose!
				);
			}
			next();
		},
		async (
			req: APIReq<{ recipeId: string }, { recipe: IRecipe }>,
			res: APIRes<{ updatedRecipe: IStoredRecipe }>,
			next: NextFunction
		) => {
			if (!req.files || !Array.isArray(req.files)) {
				return next({
					message: 'No files uploaded',
					statusCode: 400
				});
			}
			const recipeId = req.params.recipeId;

			const newPhotosUrls = (
				await Promise.all(
					req.files.map(file => {
						return uploadToExternalStorage(file.path);
					})
				)
			).map(photo => photo.url);

			let storedRecipe: IStoredRecipe | null = null;
			if (recipeId === '_default') {
				const { _id, ...recipe } = defaultRecipe;
				storedRecipe = await createRecipe({
					...recipe,
					photos: newPhotosUrls,
					userId: (req.user as IStoredUser)._id
				});
			} else {
				const previouslyStoredRecipe = await getRecipeById(recipeId);
				if (!previouslyStoredRecipe) {
					return next({
						message: 'Recipe not found',
						statusCode: 404
					});
				}
				storedRecipe = await updateRecipe(recipeId, {
					...previouslyStoredRecipe,
					photos: [...previouslyStoredRecipe.photos, ...newPhotosUrls]
				});
			}

			if (!storedRecipe) {
				return next({
					message: 'Failed to upload photos',
					statusCode: 500
				});
			}

			res.status(200).json({
				success: true,
				message: 'Photos uploaded',
				data: { updatedRecipe: storedRecipe }
			});
		}
	];
};

export const v0DeletePhotoController = () => {
	return async (
		req: APIReq<{ recipeId: string; photoId: string }>,
		res: APIRes<{ updatedRecipe: IStoredRecipe }>,
		next: NextFunction
	) => {
		const { photoId, recipeId } = req.params;

		const storedRecipe = await getRecipeById(recipeId);
		if (!storedRecipe) {
			return next({
				message: 'Recipe not found',
				statusCode: 404
			});
		}

		const deleteResponse = await deleteFromExternalStorage(
			`doh/${parse(photoId).name}`
		);
		if (deleteResponse.result !== 'ok') {
			return next({
				message: 'Failed to delete photo',
				statusCode: 500
			});
		}

		const updatedRecipe = await updateRecipe(recipeId, {
			...storedRecipe,
			photos: storedRecipe.photos.filter(
				photo => photo.split('/').pop() !== photoId
			)
		});

		if (!updatedRecipe) {
			return next({
				message: 'Failed to delete photo',
				statusCode: 500
			});
		}

		res.status(200).json({
			success: true,
			message: 'Photo deleted',
			data: { updatedRecipe }
		});
	};
};
