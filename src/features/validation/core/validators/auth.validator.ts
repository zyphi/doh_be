import { body, header } from 'express-validator';
import { setRequestBody } from '../index.core';

export const coreV0ValidationSignup = () => [
	body('password').escape().isLength({ min: 6, max: 50 }),
	body('email').escape().isEmail(),
	body('name').escape().isLength({ min: 2, max: 50 }),
	setRequestBody
];

export const coreV0ValidationLogin = () => [
	body('password').escape().isLength({ min: 6, max: 50 }),
	body('email').escape().isEmail(),
	setRequestBody
];

export const coreV0ValidationResetPassword = () => [
	body('email').escape().isEmail(),
	setRequestBody
];

export const coreV0ValidationSetNewPassword = () => [
	header('reset-token').escape().isLength({ min: 36, max: 36 }).isString(),
	body('password').escape().isLength({ min: 6, max: 50 }),
	body('confirmPassword').escape().isLength({ min: 6, max: 50 }),
	setRequestBody
];
