import {
	coreV0ValidationLogin,
	coreV0ValidationResetPassword,
	coreV0ValidationSetNewPassword,
	coreV0ValidationSignup
} from './core/validators/auth.validator';
import {
	coreV0ValidationCreateRecipe,
	coreV0ValidationGetRecipes
} from './core/validators/recipes.validator';
import {
	coreV0ValidationUpdatePassword,
	coreV0ValidationUpdateUser
} from './core/validators/users.validator';

export const getV0ValidationSignup = () => {
	return coreV0ValidationSignup();
};

export const getV0ValidationLogin = () => {
	return coreV0ValidationLogin();
};

export const getV0ValidationResetPassword = () => {
	return coreV0ValidationResetPassword();
};

export const getV0ValidationSetNewPassword = () => {
	return coreV0ValidationSetNewPassword();
};

export const getV0ValidationGetRecipes = () => {
	return coreV0ValidationGetRecipes();
};

export const getV0ValidationCreateRecipe = () => {
	return coreV0ValidationCreateRecipe();
};

export const getV0ValidationUpdateUser = () => {
	return coreV0ValidationUpdateUser();
};

export const getV0ValidationUpdatePassword = () => {
	return coreV0ValidationUpdatePassword();
};
