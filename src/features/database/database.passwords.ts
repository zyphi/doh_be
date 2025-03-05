import { hashString } from '#features/hashHandler';
import {
	coreFindPasswordByUserId,
	coreUpdatePasswordByUserId
} from './core/index.core';

export const getPasswordByUserId = async (userId: string) => {
	const password = await coreFindPasswordByUserId(userId);
	if (!password) {
		return null;
	}
	return password.password;
};

export const updatePasswordByUserId = async (
	userId: string,
	newPassword: string
) => {
	return await coreUpdatePasswordByUserId(userId, hashString(newPassword));
};
