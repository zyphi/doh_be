import { NextFunction, Request, Response } from 'express';

import { ISetNewPasswordUser } from '#types/types.users';

import { getV0ValidationSetNewPassword } from '#features/validation';
import {
	deleteResetToken,
	getResetToken
} from '#features/database/database.resetTokens';
import { updatePasswordByUserId } from '#features/database/database.passwords';
import { APIReq, APIRes } from '#types/types.api';

export const v0SetNewPasswordController = () => {
	return [
		...getV0ValidationSetNewPassword(),
		async (
			req: APIReq<{}, ISetNewPasswordUser>,
			res: APIRes<null>,
			next: NextFunction
		) => {
			try {
				const { password, confirmPassword, 'reset-token': token } = req.body;

				if (password !== confirmPassword) {
					return next({
						message: 'Passwords do not match',
						statusCode: 400
					});
				}

				const storedToken = await getResetToken(token);
				if (!storedToken) {
					return next({
						message: 'Invalid token',
						statusCode: 401
					});
				}

				const updatedPassword = await updatePasswordByUserId(
					storedToken.userId,
					password
				);
				if (!updatedPassword) {
					return next({
						message: 'Failed to update password',
						statusCode: 500
					});
				}

				const deleteResult = await deleteResetToken(token);
				if (!deleteResult) {
					return next({
						message: 'Failed to delete token',
						statusCode: 500
					});
				}

				res.status(200).json({
					success: true,
					message: 'Password updated successfully',
					data: null
				});
			} catch (error: any) {
				next({
					message: '[v0 setNewPassword] Internal Server Error',
					statusCode: 500
				});
			}
		}
	];
};
