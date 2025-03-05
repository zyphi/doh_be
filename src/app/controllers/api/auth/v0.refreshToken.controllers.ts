import {
	generateAccessToken,
	validateRefreshToken,
	validateToken
} from '#features/authentication';
import { APIReq, APIRes } from '#types/types.api';
import { NextFunction } from 'express';

export const v0RefreshTokenController = () => {
	return (
		req: APIReq<{ id: string }>,
		res: APIRes<string | null>,
		next: NextFunction
	) => {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return next({
				message: 'No authorization header provided',
				statusCode: 403
			});
		}

		const accessToken = authHeader.split(' ')[1];

		if (!accessToken) {
			return next({
				message: 'No token provided',
				statusCode: 403
			});
		}

		const accessTokenIsValid = validateToken(accessToken);
		if (accessTokenIsValid) {
			res.json({ data: null, success: true, message: 'Token still valid' });
			return;
		}

		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return next({
				message: 'No refresh token provided',
				statusCode: 403
			});
		}
		const refreshTokenIsValid = validateRefreshToken(refreshToken);

		if (!refreshTokenIsValid) {
			return next({
				message: 'Invalid refresh token',
				statusCode: 403
			});
		}

		const newAccessToken = generateAccessToken(req.params.id);

		res.json({
			data: newAccessToken,
			success: true,
			message: 'Token refreshed'
		});
	};
};
