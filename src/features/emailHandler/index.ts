import { coreSendEmail } from './core/index.core';

export const sendEmail = async (
	subject: string,
	html: string,
	text: string
) => {
	try {
		return await coreSendEmail(
			process.env.NODEMAILER_HOST as string,
			parseInt(process.env.NODEMAILER_PORT as string),
			process.env.NODEMAILER_USER as string,
			process.env.NODEMAILER_PASS as string,
			process.env.NODEMAILER_FROM as string,
			process.env.NODEMAILER_TO as string,
			subject,
			html,
			text
		);
	} catch (error) {
		return null;
	}
};
