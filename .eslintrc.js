module.exports = {
	extends: ['plugin:prettier/recommended', 'plugin:import/recommended'],
	rules: {
		'prettier/prettier': 'error',
		'import/extensions': ['error', 'always'],
	},
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: 'module',
		requireConfigFile: false,
		babelOptions: {
			babelrc: false,
			configFile: false,
		},
	},
};
