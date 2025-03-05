import bcrypt from 'bcrypt';

export const coreHashString = (source: string, saltRounds: number) =>
	bcrypt.hashSync(source, saltRounds);

export const coreCompareHash = (source: string, hash: string) =>
	bcrypt.compareSync(source, hash);
