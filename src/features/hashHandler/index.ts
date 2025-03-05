import { coreCompareHash, coreHashString } from './core/index.core';

const SALT_ROUNDS = process.env.SALT_ROUNDS || '10';

export const hashString = (source: string) =>
	coreHashString(source, parseInt(SALT_ROUNDS));

export const compareHash = (source: string, hash: string) =>
	coreCompareHash(source, hash);
