import { Router } from 'express';

import {
	v0GetRecipesController,
	v0CreateRecipeController,
	v0GetRecipeController,
	v0UpdateRecipeController,
	v0DeleteRecipeController,
	v0UploadPhotosController,
	v0DeletePhotoController
} from '#app/controllers/api/recipes/v0.recipes.controllers';

const v0RecipesRouter = Router();

v0RecipesRouter.get('/', v0GetRecipesController());

v0RecipesRouter.post('/', v0CreateRecipeController());

v0RecipesRouter.get('/:id', v0GetRecipeController());

v0RecipesRouter.put('/:id', v0UpdateRecipeController());

v0RecipesRouter.delete('/:id', v0DeleteRecipeController());

v0RecipesRouter.delete(
	'/delete-photo/:recipeId/:photoId',
	v0DeletePhotoController()
);

v0RecipesRouter.patch('/:recipeId/upload-photos', v0UploadPhotosController());

export default v0RecipesRouter;
