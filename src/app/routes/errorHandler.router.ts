import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
	err: any,
	_: Request,
	res: Response,
	next: NextFunction
) => {
	if (res.headersSent) {
		return next(err);
	}

	const { message, statusCode } = err;

	res.status(statusCode || 500).json({
		success: false,
		message: message || 'Internal Server Error',
		data: null
	});
};
