import { model, Schema } from 'mongoose';

import { IUpdatedUser, IUser } from '#types/types.users';

import { normalizeDocument } from '../index.core';

const UserSchema = new Schema<IUser>({
	email: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	profilePictureUrl: {
		type: String,
		default: null
	}
});

const User = model<IUser>('User', UserSchema);

export const coreCreateUser = async (newUser: IUser) => {
	try {
		return normalizeDocument(await User.create(newUser));
	} catch (error) {
		return null;
	}
};

export const coreFindUserById = async (id: string) => {
	const user = await User.findById(id);
	return user ? normalizeDocument(user) : null;
};

export const coreFindUserByEmail = async (email: string) => {
	const storedUser = await User.findOne({ email });
	return storedUser ? normalizeDocument(storedUser) : null;
};

export const coreDeleteUser = async (id: string) => {
	const deletedUser = await User.findByIdAndDelete(id);
	return deletedUser ? normalizeDocument(deletedUser) : null;
};

export const coreUpdateUser = async (updatedUser: IUpdatedUser) => {
	const user = await User.findByIdAndUpdate(updatedUser._id, updatedUser, {
		new: true
	});
	return user ? normalizeDocument(user) : null;
};
