import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import cookieParser from 'cookie-parser';
import fs from 'fs';

import { authenticate } from '#features/authentication';
import { findUserById } from '#features/database/database.users';
import { APIRes } from '#types/types.api';

export const globalMiddleware = [
	cookieParser(),
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true
	}),
	helmet.contentSecurityPolicy({
		directives: {
			scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
			'img-src': ["'self'", 'data:', 'blob:']
		}
	}),
	express.urlencoded(),
	express.json(),
	express.static(path.resolve('../frontend/dist'))
];

export const storageMiddleware = [
	authenticate(process.env.JWT_SECRET as string, findUserById, {
		message: 'Unauthorized',
		statusCode: 401
	}),
	async (
		req: Request,
		res: APIRes<{ content: string; mimeType: string }>,
		next: NextFunction
	) => {
		try {
			const filePath = path.resolve(path.join('./storage', req.path));

			if (!fs.existsSync(filePath)) {
				return next({
					statusCode: 404,
					message: 'File not found'
				});
			}

			const fileBuffer = await fs.promises.readFile(filePath);
			const fileBase64 = fileBuffer.toString('base64');
			const extension = path.extname(filePath).slice(1);

			res.json({
				success: true,
				data: {
					mimeType: `application/${extension}`,
					content: fileBase64
				},
				message: 'File sent'
			});
		} catch (error) {
			next({
				statusCode: 500,
				message: 'Internal server error'
			});
		}
	}
];
