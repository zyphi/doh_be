import { NextFunction, Request, Response } from 'express';
import { IBaseUser } from '#types/types.users';
import { getV0ValidationResetPassword } from '#features/validation';

import { sendEmail } from '#features/emailHandler';
import { findUserByEmail } from '#features/database/database.users';
import { createResetToken } from '#features/database/database.resetTokens';
import { APIReq, APIRes } from '#types/types.api';

export const v0ResetPasswordController = () => {
	return [
		...getV0ValidationResetPassword(),
		async (
			req: APIReq<{}, IBaseUser>,
			res: APIRes<null>,
			next: NextFunction
		) => {
			try {
				const { email } = req.body;

				const storedUser = await findUserByEmail(email);
				if (!storedUser) {
					return next({
						message: 'User not found',
						statusCode: 404
					});
				}

				const newResetToken = await createResetToken(storedUser._id);
				if (!newResetToken) {
					return next({
						message: 'Failed to create reset token',
						statusCode: 500
					});
				}

				const passwordResetLink = `${process.env.FRONTEND_URL}/auth/set-new-password?tkn=${newResetToken}`;
				const emailHtml = `
				<main>
					<h1>Password Reset</h1>
					<p>Hi, ${storedUser.name}</p>
					<p>Click the link below to reset your password:</p>
					<a href="${passwordResetLink}">reset</a>
				</main>
				`;

				const emailText = `
Password Reset
Hi, ${storedUser.name}
Follow the link below to reset your password:
${passwordResetLink}
				`;

				const sentEmail = await sendEmail(
					'Password Reset',
					emailHtml,
					emailText
				);
				if (!sentEmail) {
					return next({
						message: 'Failed to send email',
						statusCode: 500
					});
				}

				res.status(200).json({
					success: true,
					message: 'Password reset email sent',
					data: null
				});
			} catch (error: any) {
				next({
					message: '[v0 resetPassword] Internal Server Error',
					statusCode: 500
				});
			}
		}
	];
};
