import test from 'ava';
import {
	validateMealName,
	validateMealWeight,
	validateMealTags,
	validateMealDescription,
	validateMealInput,
	sanitizeString,
} from './validation.js';

test('validateMealName - valid names', t => {
	const validNames = ['牛肉麵', 'Pizza', '壽司', '123', '餐廳名稱'];

	for (const name of validNames) {
		const result = validateMealName(name);
		t.true(result.isValid, `Name "${name}" should be valid`);
	}
});

test('validateMealName - empty or invalid names', t => {
	const invalidCases = [
		{input: '', expectedError: '餐點名稱不能為空'},
		{input: '   ', expectedError: '餐點名稱不能為空'},
		{input: 'a'.repeat(51), expectedError: '餐點名稱不能超過50個字元'},
		{input: '測試<script>', expectedError: '餐點名稱包含無效字元'},
		{input: '測試"引號"', expectedError: '餐點名稱包含無效字元'},
	];

	for (const {input, expectedError} of invalidCases) {
		const result = validateMealName(input);
		t.false(result.isValid, `Name "${input}" should be invalid`);
		t.is(result.error, expectedError);
	}
});

test('validateMealWeight - valid weights', t => {
	const validWeights = [
		{input: '1', expected: 1},
		{input: '5', expected: 5},
		{input: 3, expected: 3},
		{input: '2', expected: 2},
	];

	for (const {input, expected} of validWeights) {
		const result = validateMealWeight(input);
		t.true(result.isValid, `Weight ${input} should be valid`);
		t.is(result.value, expected);
	}
});

test('validateMealWeight - invalid weights', t => {
	const invalidCases = [
		{input: '0', expectedError: '權重必須在 1-5 之間'},
		{input: '6', expectedError: '權重必須在 1-5 之間'},
		{input: 'abc', expectedError: '權重必須是有效的數字'},
		{input: '1.5', expectedError: '權重必須是整數'},
		{input: '', expectedError: '權重必須是有效的數字'},
		{input: '  ', expectedError: '權重必須是有效的數字'},
	];

	for (const {input, expectedError} of invalidCases) {
		const result = validateMealWeight(input);
		t.false(result.isValid, `Weight "${input}" should be invalid`);
		t.is(result.error, expectedError);
	}
});

test('validateMealTags - valid tags', t => {
	const validTags = ['', ' ', '中式,日式', 'vegetarian,spicy', '測試標籤'];

	for (const tags of validTags) {
		const result = validateMealTags(tags);
		t.true(result.isValid, `Tags "${tags}" should be valid`);
	}
});

test('validateMealTags - invalid tags', t => {
	const invalidCases = [
		{input: 'a'.repeat(101), expectedError: 'Tags 不能超過100個字元'},
		{input: '測試<script>', expectedError: 'Tags 包含無效字元'},
	];

	for (const {input, expectedError} of invalidCases) {
		const result = validateMealTags(input);
		t.false(result.isValid, `Tags "${input}" should be invalid`);
		t.is(result.error, expectedError);
	}
});

test('validateMealDescription - valid descriptions', t => {
	const validDescriptions = [
		'',
		' ',
		'這是一道很棒的餐點',
		'Very delicious food with special sauce',
	];

	for (const desc of validDescriptions) {
		const result = validateMealDescription(desc);
		t.true(result.isValid, `Description "${desc}" should be valid`);
	}
});

test('validateMealDescription - invalid descriptions', t => {
	const invalidCases = [
		{input: 'a'.repeat(201), expectedError: '描述不能超過200個字元'},
		{input: '測試<script>', expectedError: '描述包含無效字元'},
	];

	for (const {input, expectedError} of invalidCases) {
		const result = validateMealDescription(input);
		t.false(result.isValid, `Description "${input}" should be invalid`);
		t.is(result.error, expectedError);
	}
});

test('validateMealInput - valid complete input', t => {
	const validInputs = [
		['牛肉麵', '5', '中式,湯麵', '經典台灣小吃'],
		['Pizza', '3', '義式,起司', ''],
		['壽司', '4', '', '新鮮海鮮'],
	];

	for (const input of validInputs) {
		const result = validateMealInput(input);
		t.true(result.isValid, `Input ${JSON.stringify(input)} should be valid`);
		t.truthy(result.data);
	}
});

test('validateMealInput - invalid inputs', t => {
	const invalidCases = [
		{
			input: ['', '5', 'tags', 'desc'],
			expectedErrors: ['餐點名稱不能為空'],
		},
		{
			input: ['牛肉麵', 'abc', 'tags', 'desc'],
			expectedErrors: ['權重必須是有效的數字'],
		},
		{
			input: ['牛肉麵', '6', 'tags', 'desc'],
			expectedErrors: ['權重必須在 1-5 之間'],
		},
		{
			input: ['a'.repeat(51), '5', 'tags', 'desc'],
			expectedErrors: ['餐點名稱不能超過50個字元'],
		},
		{
			input: ['牛肉麵', '5', 'a'.repeat(101), 'desc'],
			expectedErrors: ['Tags 不能超過100個字元'],
		},
		{
			input: ['牛肉麵', '5', 'tags', 'a'.repeat(201)],
			expectedErrors: ['描述不能超過200個字元'],
		},
	];

	for (const {input, expectedErrors} of invalidCases) {
		const result = validateMealInput(input);
		t.false(result.isValid, `Input ${JSON.stringify(input)} should be invalid`);
		t.deepEqual(result.errors, expectedErrors);
	}
});

test('validateMealInput - insufficient input', t => {
	const result = validateMealInput(['牛肉麵']); // Only name, missing weight
	t.false(result.isValid);
	t.deepEqual(result.errors, ['必須提供餐點名稱和權重']);
});

test('sanitizeString - basic functionality', t => {
	const testCases = [
		{input: '  hello world  ', expected: 'hello world'},
		{input: 'test<script>alert("xss")</script>', expected: 'testalert("xss")'},
		{input: 'normal text', expected: 'normal text'},
		{input: '', expected: ''},
		{input: 'a'.repeat(2000), expected: 'a'.repeat(1000)},
	];

	for (const {input, expected} of testCases) {
		const result = sanitizeString(input);
		t.is(result, expected);
	}
});
