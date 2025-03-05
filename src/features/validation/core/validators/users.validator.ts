import { body } from 'express-validator';
import { setRequestBody } from '../index.core';

export const coreV0ValidationUpdateUser = () => [
	body('email').escape().isEmail(),
	body('name').escape().isLength({ min: 2, max: 50 }),
	setRequestBody
];

export const coreV0ValidationUpdatePassword = () => [
	body('password').escape().isLength({ min: 8, max: 50 }),
	body('confirmPassword').escape().isLength({ min: 8, max: 50 }),
	setRequestBody
];
