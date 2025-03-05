import { NextFunction, Request, Response } from 'express';
import {
	matchedData,
	Result,
	ValidationError,
	validationResult
} from 'express-validator';

const formatErrors = (errors: Result<ValidationError>) =>
	errors
		.array()
		.map((err: any) => `${err.path}: ${err.msg}`)
		.join(', ');

const getErrors = (req: Request) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return {
			message: formatErrors(errors),
			statusCode: 400
		};
	}
	return null;
};

export const setRequestBody = (
	req: Request,
	_: Response,
	next: NextFunction
) => {
	const errors = getErrors(req);
	if (errors) {
		return next(errors);
	}

	req.body = matchedData(req);
	next();
};
