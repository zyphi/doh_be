import { Request, Response, Router } from 'express';

const catchall = Router();

catchall.use((_: Request, res: Response) => {
	res.status(404).json({
		success: false,
		message: 'Route not found',
		data: null
	});
});

export default catchall;
