import { model, Schema } from 'mongoose';

import { IResetToken } from '#types/types.tokens';

import { normalizeDocument } from '../index.core';

const ResetTokenSchema = new Schema<IResetToken>({
	token: {
		type: String,
		required: true
	},
	userId: {
		type: String,
		required: true,
		ref: 'User'
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const ResetToken = model<IResetToken>('ResetToken', ResetTokenSchema);

export const coreCreateResetToken = async (newResetToken: IResetToken) => {
	try {
		return normalizeDocument(await ResetToken.create(newResetToken));
	} catch (_) {
		return null;
	}
};

export const coreDeleteAllUserResetTokens = async (userId: string) => {
	const deleteResult = await ResetToken.deleteMany({ userId });
	return deleteResult.deletedCount > 0;
};

export const coreDeleteToken = async (token: string) => {
	const deleteResult = await ResetToken.deleteOne({ token });
	return deleteResult.deletedCount > 0;
};

export const coreGetResetToken = async (token: string) => {
	const storedToken = await ResetToken.findOne({ token });
	return storedToken ? normalizeDocument(storedToken) : null;
};
