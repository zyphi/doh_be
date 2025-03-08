import { hashString } from '#features/hashHandler';
import { IStoredUser, IUpdatedUser } from '#types/types.users';
import {
	coreCreateUser,
	coreCreatePassword,
	coreFindUserById,
	coreDeleteUser,
	coreFindUserByEmail,
	coreUpdateUser,
	coreGetUsername
} from './core/index.core';

export const createUser = async (
	email: string,
	name: string,
	profilePictureUrl: string,
	password: string
) => {
	const createdUser = await coreCreateUser({
		email,
		name,
		profilePictureUrl
	});
	if (!createdUser) {
		return null;
	}

	const createdPassword = await coreCreatePassword({
		password: hashString(password),
		userId: createdUser._id.toString()
	});
	if (!createdPassword) {
		await coreDeleteUser(createdUser._id.toString());
		return null;
	}

	return createdUser;
};

export const findUserById = async (id: string) => {
	return await coreFindUserById(id);
};

export const findUserByEmail = async (email: string) => {
	return await coreFindUserByEmail(email);
};

export const updateUser = async (updatedUser: IUpdatedUser) => {
	return await coreUpdateUser(updatedUser);
};

export const deleteUser = async (id: string) => {
	return await coreDeleteUser(id);
};

export const getUsername = async (id: string) => {
	return await coreGetUsername(id);
};
