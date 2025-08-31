/**
 * Validation utilities for meal input data
 */

export interface MealInput {
	name: string;
	weight: number;
	tags?: string;
	description?: string;
}

export interface ValidationResult {
	isValid: boolean;
	errors: string[];
	data?: MealInput;
}

/**
 * Validates meal name
 */
export function validateMealName(name: string): {
	isValid: boolean;
	error?: string;
} {
	if (!name || typeof name !== 'string') {
		return {isValid: false, error: '餐點名稱不能為空'};
	}

	const trimmedName = name.trim();
	if (trimmedName.length === 0) {
		return {isValid: false, error: '餐點名稱不能為空'};
	}

	if (trimmedName.length > 50) {
		return {isValid: false, error: '餐點名稱不能超過50個字元'};
	}

	// Check for potentially harmful characters
	const harmfulChars = /[<>\"'&]/;
	if (harmfulChars.test(trimmedName)) {
		return {isValid: false, error: '餐點名稱包含無效字元'};
	}

	return {isValid: true};
}

/**
 * Validates meal weight
 */
export function validateMealWeight(weight: string | number): {
	isValid: boolean;
	error?: string;
	value?: number;
} {
	const numWeight = typeof weight === 'string' ? Number(weight) : weight;

	if (isNaN(numWeight)) {
		return {isValid: false, error: '權重必須是有效的數字'};
	}

	if (!Number.isInteger(numWeight)) {
		return {isValid: false, error: '權重必須是整數'};
	}

	if (numWeight < 1 || numWeight > 5) {
		return {isValid: false, error: '權重必須在 1-5 之間'};
	}

	return {isValid: true, value: numWeight};
}

/**
 * Validates meal tags
 */
export function validateMealTags(tags: string): {
	isValid: boolean;
	error?: string;
} {
	if (!tags || tags.trim().length === 0) {
		return {isValid: true}; // Tags are optional
	}

	if (tags.length > 100) {
		return {isValid: false, error: 'Tags 不能超過100個字元'};
	}

	// Check for potentially harmful characters
	const harmfulChars = /[<>\"'&]/;
	if (harmfulChars.test(tags)) {
		return {isValid: false, error: 'Tags 包含無效字元'};
	}

	return {isValid: true};
}

/**
 * Validates meal description
 */
export function validateMealDescription(description: string): {
	isValid: boolean;
	error?: string;
} {
	if (!description || description.trim().length === 0) {
		return {isValid: true}; // Description is optional
	}

	if (description.length > 200) {
		return {isValid: false, error: '描述不能超過200個字元'};
	}

	// Check for potentially harmful characters
	const harmfulChars = /[<>\"'&]/;
	if (harmfulChars.test(description)) {
		return {isValid: false, error: '描述包含無效字元'};
	}

	return {isValid: true};
}

/**
 * Comprehensive validation for all meal input fields
 */
export function validateMealInput(logs: string[]): ValidationResult {
	const errors: string[] = [];

	if (logs.length < 2) {
		return {
			isValid: false,
			errors: ['必須提供餐點名稱和權重'],
		};
	}

	const nameInput = logs[0] || '';
	const weightInput = logs[1] || '';
	const tagsInput = logs[2] || '';
	const descriptionInput = logs[3] || '';

	// Validate name
	const nameValidation = validateMealName(nameInput);
	if (!nameValidation.isValid) {
		errors.push(nameValidation.error!);
	}

	// Validate weight
	const weightValidation = validateMealWeight(weightInput);
	if (!weightValidation.isValid) {
		errors.push(weightValidation.error!);
	}

	// Validate tags
	const tagsValidation = validateMealTags(tagsInput);
	if (!tagsValidation.isValid) {
		errors.push(tagsValidation.error!);
	}

	// Validate description
	const descriptionValidation = validateMealDescription(descriptionInput);
	if (!descriptionValidation.isValid) {
		errors.push(descriptionValidation.error!);
	}

	if (errors.length > 0) {
		return {
			isValid: false,
			errors,
		};
	}

	return {
		isValid: true,
		errors: [],
		data: {
			name: nameInput.trim(),
			weight: weightValidation.value!,
			tags: tagsInput.trim() || undefined,
			description: descriptionInput.trim() || undefined,
		},
	};
}

/**
 * Sanitizes string input by trimming and removing potentially harmful characters
 */
export function sanitizeString(input: string): string {
	if (!input || typeof input !== 'string') {
		return '';
	}

	return input
		.trim()
		.replace(/[<>\"'&]/g, '') // Remove potentially harmful characters
		.slice(0, 1000); // Prevent extremely long inputs
}
