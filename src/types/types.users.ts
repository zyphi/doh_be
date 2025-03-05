export interface IBaseUser {
	email: string;
}

export interface IUser extends IBaseUser {
	name: string;
	profilePictureUrl: string | null;
}

export interface ISignupUser extends IUser {
	password: string;
}

export interface ILoginUser extends IBaseUser {
	password: string;
}

export interface ISetNewPasswordUser {
	password: string;
	confirmPassword: string;
	'reset-token': string;
}

export interface IStoredUser extends IUser {
	_id: string;
}

export interface IUpdatedUser {
	_id: string;
	name: string;
}
