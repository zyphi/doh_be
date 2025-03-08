import { NextFunction, Request, Response } from 'express';

import {
	updateUser,
	deleteUser,
	getUsername
} from '#features/database/database.users';
import {
	getV0ValidationUpdatePassword,
	getV0ValidationUpdateUser
} from '#features/validation';
import { IStoredUser, IUser } from '#types/types.users';
import { APIReq, APIRes } from '#types/types.api';
import { updatePasswordByUserId } from '#features/database/database.passwords';

export const v0GetUserController = () => {
	return (
		req: APIReq<{ id: string }>,
		res: APIRes<{ user: IStoredUser }>,
		next: NextFunction
	) => {
		const userId = req.params.id;

		const requestUser = req.user as IStoredUser;

		if (userId !== requestUser._id) {
			return next({
				message: 'Unauthorized to fetch user',
				statusCode: 401
			});
		}

		res.status(200).json({
			success: true,
			message: 'Successfully fetched user',
			data: { user: requestUser }
		});
	};
};

export const v0GetUsernameController = () => {
	return async (
		req: APIReq<{ id: string }>,
		res: APIRes<{ username: string }>,
		next: NextFunction
	) => {
		const userId = req.params.id;

		const username = await getUsername(userId);

		if (!username) {
			return next({
				statusCode: 404,
				message: 'Username not found'
			});
		}

		res.status(200).json({
			success: true,
			message: 'Successfully fetched user',
			data: { username }
		});
	};
};

export const v0UpdateUserController = () => {
	return [
		async (
			req: APIReq<{ id: string }, IUser>,
			res: APIRes<{ updatedUser: IStoredUser }>,
			next: NextFunction
		) => {
			const userId = req.params.id;
			const requestUser = req.user as IStoredUser;

			if (userId !== requestUser._id) {
				return next({
					message: 'Unauthorized to update user',
					statusCode: 401
				});
			}

			const newUser = req.body;
			const updatedUser = await updateUser({ name: newUser.name, _id: userId });

			if (!updatedUser) {
				return next({
					message: 'Failed to update user',
					statusCode: 500
				});
			}

			res.status(200).json({
				success: true,
				message: 'Successfully updated user',
				data: { updatedUser }
			});
		}
	];
};

export const v0DeleteUserController = () => {
	return async (
		req: APIReq<{ id: string }>,
		res: APIRes<null>,
		next: NextFunction
	) => {
		const userId = req.params.id;
		const requestUser = req.user as IStoredUser;

		if (userId !== requestUser._id) {
			return next({
				message: 'Unauthorized to delete user',
				statusCode: 401
			});
		}

		const deletedUser = await deleteUser(userId);

		if (!deletedUser) {
			return next({
				message: 'Failed to delete user',
				statusCode: 500
			});
		}

		res.status(200).json({
			success: true,
			message: 'Successfully deleted user',
			data: null
		});
	};
};

export const v0UpdatePasswordController = () => {
	return [
		...getV0ValidationUpdatePassword(),
		async (
			req: APIReq<
				{ id: string },
				{ password: string; confirmPassword: string }
			>,
			res: APIRes<null>,
			next: NextFunction
		) => {
			const userId = req.params.id;
			const { password, confirmPassword } = req.body;

			if (password !== confirmPassword) {
				return next({
					message: 'Passwords do not match',
					statusCode: 400
				});
			}

			const requestUser = req.user as IStoredUser;

			if (userId !== requestUser._id) {
				return next({
					message: 'Unauthorized to update password',
					statusCode: 401
				});
			}

			const updatedPassword = await updatePasswordByUserId(userId, password);

			if (!updatedPassword) {
				return next({
					message: 'Failed to update password',
					statusCode: 500
				});
			}

			res.status(200).json({
				success: true,
				message: 'Successfully updated password',
				data: null
			});
		}
	];
};
