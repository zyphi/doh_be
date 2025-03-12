import path from 'path';

import {
	coreUploadFile,
	coreRemoveFile,
	coreCompressPicture,
	coreUploadMultipleFiles,
	coreUploadToExternalStorage,
	coreDeleteFromExternalStorage
} from './core/index.core';

export const uploadUserProfilePicture = coreUploadFile(
	parseInt(process.env.UPLOAD_SIZE_LIMIT as string),
	1,
	(process.env.UPLOAD_ALLOWED_MIME_TYPES as string).split(','),
	path.join('storage', 'users'),
	'profilePicture'
);

export const uploadToExternalStorage = async (imagePath: string) => {
	return await coreUploadToExternalStorage(
		process.env.CLOUDINARY_FOLDER as string,
		imagePath
	);
};

export const deleteFromExternalStorage = async (publicId: string) => {
	return await coreDeleteFromExternalStorage(publicId);
};

export const uploadRecipePhotos = coreUploadMultipleFiles(
	parseInt(process.env.UPLOAD_SIZE_LIMIT as string),
	parseInt(process.env.UPLOAD_FILES_NUMBER_LIMIT as string),
	(process.env.UPLOAD_ALLOWED_MIME_TYPES as string).split(','),
	path.join('storage', 'recipes'),
	'photos'
);

export const removeFile = (path: string) => coreRemoveFile(path);

export const compressPicture = (inputPath: string) => {
	return coreCompressPicture(inputPath);
};

export const cleanUpUserProfilePictures = async (path: string) => {
	await coreRemoveFile(path);
	// await coreRemoveFile(`${path}__preview`);
};
