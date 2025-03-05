import { Router } from 'express';

import v0AuthRouter from '#app/routes/api/routers/v0.auth.router';
import v0RecipesRouter from '#app/routes/api/routers/v0.recipes.router';

import { authenticate } from '#features/authentication';
import { findUserById } from '#features/database/database.users';
import v0UsersRouter from '#app/routes/api/routers/v0.users.router';

const apiRouter = Router();

apiRouter.use('/v0/auth', v0AuthRouter);

apiRouter.use(
	'/v0/recipes',
	authenticate(process.env.JWT_SECRET as string, findUserById, {
		message: 'Unauthorized',
		statusCode: 401
	}),
	v0RecipesRouter
);

apiRouter.use(
	'/v0/users',
	authenticate(process.env.JWT_SECRET as string, findUserById, {
		message: 'Unauthorized',
		statusCode: 401
	}),
	v0UsersRouter
);

export default apiRouter;
