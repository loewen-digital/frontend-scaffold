import fs from 'node:fs';
import path from 'node:path';
import { copy } from './utils.js';

export async function scaffold(cwd, version, options) {
	write_template_files(cwd, version, options);
	add_fields_to_package(cwd, version, options);
}

function write_template_files(cwd, version, options) {
	if (options.editorconfig) {
		copy(`.editorconfig`, `${cwd}/.editorconfig`);
	}
}

function add_fields_to_package(cwd, version, options) {
	const pkg_file = path.join(cwd, 'package.json');

	// read package.json
	const pkg = JSON.parse(fs.readFileSync(pkg_file, 'utf-8'));

	// add frontend-scaffold package to devDependency
	pkg.devDependencies['@loewen-digital/frontend-scaffold'] = `^${version}`;

	if (options.prettier) {
		pkg.prettier = '@loewen-digital/frontend-scaffold/prettier.config.js';
	}

	if (options.eslint) {
		pkg.eslintConfig = {
			extends: './node_modules/@loewen-digital/frontend-scaffold/.eslintrc.js',
		};
	}

	if (options.stylelint) {
		pkg.stylelint = {
			extends: '@loewen-digital/frontend-scaffold/stylelint.config.js',
			ignoreFiles: ['**/*.md'],
		};
	}

	if (options.husky) {
		pkg.husky = {
			hooks: {
				'pre-commit': 'lint-staged',
			},
		};
		pkg['lint-staged'] = {
			'*.{css,js,json,yaml,yml,md}': ['prettier --write'],
		};
	}

	// sort dependencies
	pkg.devDependencies = sort_keys(pkg.devDependencies);

	// write package.json
	fs.writeFileSync(pkg_file, JSON.stringify(pkg, null, '	'));
}

function sort_keys(obj) {
	if (!obj) return;

	const sorted = {};
	Object.keys(obj)
		.sort()
		.forEach((key) => {
			sorted[key] = obj[key];
		});

	return sorted;
}
