import { v4 } from 'uuid';

import {
	coreCreateResetToken,
	coreDeleteAllUserResetTokens,
	coreGetResetToken,
	coreDeleteToken
} from './core/index.core';

export const createResetToken = async (userId: string) => {
	await coreDeleteAllUserResetTokens(userId);

	const createdResetToken = await coreCreateResetToken({
		token: v4(),
		userId,
		createdAt: new Date()
	});

	if (!createdResetToken) {
		return null;
	}

	return createdResetToken.token;
};

export const getResetToken = async (token: string) => {
	const resetToken = await coreGetResetToken(token);
	if (!resetToken) {
		return null;
	}

	if (
		Date.now() - new Date(resetToken.createdAt).getTime() >
		parseInt(process.env.RESET_TOKEN_EXPIRATION_MILLISECONDS as string)
	) {
		await coreDeleteToken(token);
		return null;
	}

	return resetToken;
};

export const deleteResetToken = async (token: string) => {
	return await coreDeleteToken(token);
};
