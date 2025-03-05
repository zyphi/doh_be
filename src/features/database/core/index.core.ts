import mongoose, { Document, HydratedDocument, ObjectId } from 'mongoose';

export const coreConnect = async (URI: string) => {
	await mongoose.connect(URI);
};

export const normalizeDocument = <T>(
	document: HydratedDocument<T>
): T & { _id: string } => {
	return {
		...document.toObject({ versionKey: false }),
		_id: (document._id as ObjectId).toString()
	};
};

export const pruneDocument = <T>(document: HydratedDocument<T>): T => {
	const { _id, ...prunedDocument } = document.toObject({ versionKey: false });
	return prunedDocument as T;
};

export * from './models/User';
export * from './models/Password';
export * from './models/ResetToken';
export * from './models/Recipe';
