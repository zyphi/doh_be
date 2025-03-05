import { model, Schema } from 'mongoose';

import { IPassword } from '#types/types.passwords';

import { normalizeDocument } from '../index.core';

const PasswordSchema = new Schema<IPassword>({
	password: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true,
		ref: 'User'
	}
});

const Password = model<IPassword>('Password', PasswordSchema);

export const coreCreatePassword = async (newPassword: IPassword) => {
	try {
		return normalizeDocument(await Password.create(newPassword));
	} catch (_) {
		return null;
	}
};

export const coreFindPasswordByUserId = async (userId: string) => {
	const password = await Password.findOne({ userId });
	return password ? normalizeDocument(password) : null;
};

export const coreUpdatePasswordByUserId = async (
	userId: string,
	newPassword: string
) => {
	const updateResult = await Password.updateOne(
		{ userId },
		{ password: newPassword }
	);
	return updateResult.modifiedCount > 0;
};
