import { NextFunction, Request, Response } from 'express';

import { ILoginUser } from '#types/types.users';

import { getV0ValidationLogin } from '#features/validation';
import { compareHash } from '#features/hashHandler';
import {
	generateRefreshToken,
	generateAccessToken
} from '#features/authentication';
import { findUserByEmail } from '#features/database/database.users';
import { getPasswordByUserId } from '#features/database/database.passwords';
import { APIReq, APIRes } from '#types/types.api';

export const v0LoginController = () => {
	return [
		...getV0ValidationLogin(),
		async (
			req: APIReq<{}, ILoginUser>,
			res: APIRes<{ token: string }>,
			next: NextFunction
		) => {
			try {
				const { email, password } = req.body;

				const storedUser = await findUserByEmail(email);
				if (!storedUser) {
					return next({
						message: 'User not found',
						statusCode: 404
					});
				}
				const storedPassword = await getPasswordByUserId(
					storedUser._id.toString()
				);
				if (!storedPassword) {
					return next({
						message: 'Password not found',
						statusCode: 500
					});
				}

				if (!compareHash(password, storedPassword)) {
					return next({
						message: 'Invalid password',
						statusCode: 401
					});
				}

				const token = generateAccessToken(storedUser._id);
				const refreshToken = generateRefreshToken();

				res.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.HTTPS_ONLY === 'true',
					path: '/'
				});

				res.status(200).json({
					success: true,
					message: 'Successfully logged in',
					data: { token }
				});
			} catch (error: any) {
				next({
					message: '[v0 login] Internal Server Error',
					statusCode: 500
				});
			}
		}
	];
};
