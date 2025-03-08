import { Router } from 'express';

import {
	v0UpdateUserController,
	v0DeleteUserController,
	v0GetUserController,
	v0UpdatePasswordController,
	v0GetUsernameController
} from '#app/controllers/api/users/v0.users.controllers';

const v0UsersRouter = Router();

v0UsersRouter.get('/:id', v0GetUserController());

v0UsersRouter.get('/:id/username', v0GetUsernameController());

v0UsersRouter.put('/:id', v0UpdateUserController());

v0UsersRouter.delete('/:id', v0DeleteUserController());

v0UsersRouter.patch('/:id/update-password', v0UpdatePasswordController());

export default v0UsersRouter;
