import { NextFunction, Request } from 'express';

import { ISignupUser } from '#types/types.users';

import { getV0ValidationSignup } from '#features/validation';
import { createUser, findUserByEmail } from '#features/database/database.users';
import {
	generateRefreshToken,
	generateAccessToken
} from '#features/authentication';
import { APIReq, APIRes } from '#types/types.api';
import {
	cleanUpUserProfilePictures,
	compressPicture,
	uploadUserProfilePicture
} from '#features/fileStorage';

export const v0SignupController = () => {
	return [
		uploadUserProfilePicture,
		(req: Request, _: any, next: NextFunction) => {
			if (req.file) {
				compressPicture(req.file.path); // not awaiting/catching this on purpose!
			}
			next();
		},
		...getV0ValidationSignup(),
		async (
			req: APIReq<{}, ISignupUser>,
			res: APIRes<{ token: string }>,
			next: NextFunction
		) => {
			try {
				const { email, name, password } = req.body;

				const previouslyStoredUser = await findUserByEmail(email);
				if (previouslyStoredUser) {
					if (req.file) {
						await cleanUpUserProfilePictures(req.file.path);
					}
					return next({
						message: 'User exists',
						statusCode: 400
					});
				}

				const storedUser = await createUser(
					email,
					name,
					req.file ? req.file.filename : '',
					password
				);

				if (!storedUser) {
					if (req.file) {
						await cleanUpUserProfilePictures(req.file.path);
					}
					return next({
						message: 'Could not create user',
						statusCode: 400
					});
				}

				const authenticationToken = generateAccessToken(storedUser._id);
				const refreshToken = generateRefreshToken();

				res.cookie('refreshToken', refreshToken, {
					httpOnly: true,
					sameSite: 'strict',
					secure: process.env.HTTPS_ONLY === 'true'
				});

				res.status(201).json({
					success: true,
					message: 'Successfully signed up',
					data: { token: authenticationToken }
				});
			} catch (error: any) {
				if (req.file) {
					await cleanUpUserProfilePictures(req.file.path);
				}
				next({
					message: '[v0 signup] Internal Server Error',
					statusCode: 500
				});
			}
		}
	];
};
