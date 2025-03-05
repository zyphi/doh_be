import { coreConnect } from './core/index.core';

export const connectToDb = async (dbURI: string) => {
	try {
		await coreConnect(dbURI);
		console.log(
			'[backend/features/database] Successfully connected to database'
		);
	} catch (error) {
		console.error("[backend/features/database] Can't connect to database");
		process.exit(1);
	}
};
