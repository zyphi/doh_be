import { NextFunction } from 'express';

import {
	coreGenerateToken,
	coreRegisterJwtStrategy,
	coreValidateToken
} from './core/index.core';

import { IUser } from '#types/types.users';
import { IHttpError } from '#types/types.http';

export const authenticate = (
	jwtSecret: string,
	findUserById: (id: string) => Promise<IUser | null>,
	unauthorizedError: IHttpError
) => {
	return coreRegisterJwtStrategy(jwtSecret, findUserById, unauthorizedError);
};

export const generateAccessToken = (id: string) => {
	return coreGenerateToken(
		id,
		process.env.JWT_SECRET as string,
		parseInt(process.env.JWT_EXPIRATION_SECONDS as string)
	);
};

export const generateRefreshToken = () => {
	return coreGenerateToken(
		'',
		process.env.REFRESH_TOKEN_SECRET as string,
		parseInt(process.env.REFRESH_TOKEN_EXPIRATION_SECONDS as string)
	);
};

export const validateToken = (token: string) => {
	return coreValidateToken(token, process.env.JWT_SECRET as string);
};

export const validateRefreshToken = (refreshToken: string) => {
	return coreValidateToken(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET as string
	);
};
