import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { IUser } from '#types/types.users';
import { IHttpError } from '#types/types.http';

export const coreRegisterJwtStrategy = (
	jwtSecret: string,
	findById: (id: string) => Promise<IUser | null>,
	unauthorizedError: IHttpError
) => {
	passport.use(
		new Strategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: jwtSecret
			},
			async (payload, done) => {
				try {
					const user = await findById(payload.id);
					if (user) return done(null, user);
					return done(null, false);
				} catch (error) {
					return done(error);
				}
			}
		)
	);

	return (req: Request, res: Response, next: NextFunction) =>
		passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
			if (err) {
				console.error(
					`[backend/features/authentication] Error authenticating user: ${err}`
				);
				return;
			}
			if (!user) {
				res.status(unauthorizedError.statusCode).json({
					success: false,
					message: unauthorizedError.message,
					data: null
				});
				return;
			}
			req.user = user;
			next();
		})(req, res, next);
};

export const coreGenerateToken = (
	id: string,
	jwtSecret: string,
	expirationInMilliseconds: number
) => {
	return jwt.sign({ id }, jwtSecret, { expiresIn: expirationInMilliseconds });
};

export const coreValidateToken = (token: string, jwtSecret: string) => {
	try {
		const decodedToken = jwt.verify(token, jwtSecret);
		return !!decodedToken;
	} catch (error) {
		return false;
	}
};
