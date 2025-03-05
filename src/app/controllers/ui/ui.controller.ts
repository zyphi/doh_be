import { NextFunction, Request, Response } from 'express';
import path from 'path';

export const uiController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!['api', 'storage'].includes(req.params.any[1])) {
		res
			.status(200)
			.sendFile('index.html', { root: path.resolve('../frontend/dist') });
		return;
	}
	next();
};
