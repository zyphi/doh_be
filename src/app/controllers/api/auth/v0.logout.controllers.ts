import { APIRes } from '#types/types.api';
import { Request } from 'express';

export const v0LogoutController = () => {
	return async (_: Request, res: APIRes<null>) => {
		res.clearCookie('refreshToken');
		res.json({ data: null, success: true, message: 'Logged out' });
	};
};
