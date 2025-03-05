import { body, query } from 'express-validator';
import { setRequestBody } from '../index.core';

export const coreV0ValidationGetRecipes = () => [
	query('includeShared').escape().isBoolean(),
	query('nameFilter').escape().isString(),
	setRequestBody
];

export const coreV0ValidationCreateRecipe = () => [
	body('name').escape().isLength({ min: 1 }),
	body('isPublic').escape().isBoolean(),
	body('ballsNumber').escape().isNumeric(),
	body('ballsWeight').escape().isNumeric(),
	body('hydration').escape().isNumeric(),
	body('yeastPerKg').escape().isNumeric(),
	body('saltPerKg').escape().isNumeric(),
	body('fatPerKg').escape().isNumeric(),
	body('notes').escape().isString(),
	body('doughs').isArray(),
	body('doughs.*.isMainDough').escape().isBoolean(),
	body('doughs.*.name').escape().isString(),
	body('doughs.*.flourPercentage').escape().isNumeric(),
	body('doughs.*.waterPercentage').escape().isNumeric(),
	body('doughs.*.yeastPercentage').escape().isNumeric(),
	body('doughs.*.saltPercentage').escape().isNumeric(),
	body('doughs.*.fatPercentage').escape().isNumeric(),
	body('doughs.*.extras').isArray(),
	body('doughs.*.extras.*.name').escape().isString(),
	body('doughs.*.extras.*.amount').escape().isNumeric(),
	body('doughs.*.extras.*.unit').escape().isString(),
	body('doughs.*.flours').isArray(),
	body('doughs.*.flours.*.name').escape().isString(),
	body('doughs.*.flours.*.percentage').escape().isNumeric(),
	body('doughs.*.flours.*.isMainFlour').escape().isBoolean(),
	body('doughs.*.flours.*._id').escape().isString(),
	body('doughs.*.childrenDoughs').isArray(),
	body('doughs.*.childrenDoughs.*').escape().isString(),
	body('startTime').escape().isNumeric(),
	body('totalTime').escape().isNumeric(),
	setRequestBody
];
