module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:react-native/all',
	],
	plugins: ['@typescript-eslint', 'import', 'react', 'react-native'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		ecmaVersion: 'latest'
	},
	settings: {
		'import/ignore': ['react-native'],
	},
	rules: {
		'arrow-parens': ['error', 'always'],
		'object-curly-spacing': ['error', 'always'],
		'@typescript-eslint/no-floating-promises': 'off',
		'@typescript-eslint/no-misused-promises': ['off', { checksVoidReturn: false }],
		'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		"@typescript-eslint/no-non-null-assertion": "off",
		'import/first': 'error',
		'import/newline-after-import': 'error',
		'import/no-default-export': 'off',
		'import/no-duplicates': 'error',
		'import/order': [
			'error',
			{
				'groups': ['builtin', 'external', ['internal', 'index', 'sibling'], 'parent', 'type'],
				'newlines-between': 'always-and-inside-groups',
				'alphabetize': { order: 'ignore', caseInsensitive: false }
			}
		],
		'import/prefer-default-export': 'off',
		'camelcase': ['error', { properties: 'never' }],
		'class-methods-use-this': 'off',
		'lines-around-comment': [
			'error',
			{
				beforeBlockComment: false,
				afterBlockComment: false,
				beforeLineComment: false,
				afterLineComment: false,
			},
		],
		'max-len': 'off',
		'no-mixed-operators': 'error',
		'no-multi-spaces': ['error', { ignoreEOLComments: true }],
		'no-tabs': 'error',
		'no-void': 'error',
		'no-empty': 'off',
		'prefer-promise-reject-errors': 'off',
		'quotes': ['error', 'single', {
			avoidEscape: true,
			allowTemplateLiterals: false,
		}],
		'quote-props': ['error', 'consistent'],
		'react-native/no-color-literals': 'off',
		'react-native/no-inline-styles': 'off',
	},
	ignorePatterns: ['dist', 'node_modules'],
};