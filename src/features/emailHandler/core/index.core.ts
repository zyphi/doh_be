import nodemailer from 'nodemailer';

export const coreSendEmail = async (
	host: string,
	port: number,
	user: string,
	pass: string,
	from: string,
	to: string,
	subject: string,
	html: string,
	text: string
) => {
	const transporter = nodemailer.createTransport({
		host,
		port,
		auth: {
			user,
			pass
		}
	});

	return await transporter.sendMail({
		from,
		to,
		subject,
		html,
		text
	});
};
