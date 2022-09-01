#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { bold, cyan, gray, green } from 'kleur/colors';
import prompts from 'prompts';
import { scaffold } from './index.js';

const { version } = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'));

async function main() {
	console.log(gray(`\nfrontend-scaffold version ${version}`));
	console.log(
		'A scaffold/generator to streamline setting up new frontend projects with config files, formatters and linters.',
	);

	let cwd = process.argv[2] || process.cwd();

	const options = await prompts(
		[
			{
				type: 'toggle',
				name: 'editorconfig',
				message: 'Add .editorconfig for code formatting?',
				initial: true,
				active: 'Yes',
				inactive: 'No',
			},
			{
				type: 'toggle',
				name: 'prettier',
				message: 'Add Prettier for code formatting?',
				initial: true,
				active: 'Yes',
				inactive: 'No',
			},
			{
				type: 'toggle',
				name: 'eslint',
				message: 'Add ESLint for js linting?',
				initial: true,
				active: 'Yes',
				inactive: 'No',
			},
			{
				type: 'toggle',
				name: 'stylelint',
				message: 'Add Stylelint for css linting?',
				initial: true,
				active: 'Yes',
				inactive: 'No',
			},
			{
				type: 'toggle',
				name: 'husky',
				message: 'Add Git Hook to format staged files before committing?',
				initial: true,
				active: 'Yes',
				inactive: 'No',
			},
		],
		{
			onCancel: () => {
				process.exit(1);
			},
		},
	);

	options.name = path.basename(path.resolve(cwd));

	await scaffold(cwd, version, options);

	console.log(bold(green('\nYour project is ready!')));

	if (options.editorconfig) {
		console.log(bold('✔ .editorconfig'));
	}

	if (options.prettier) {
		console.log(bold('✔ Prettier'));
	}

	if (options.eslint) {
		console.log(bold('✔ ESLint'));
	}

	if (options.stylelint) {
		console.log(bold('✔ Stylelint'));
	}

	if (options.husky) {
		console.log(bold('✔ Git Hook'));
	}

	console.log('\nNext steps:');
	let i = 1;

	console.log(`  ${i++}: ${bold(cyan('npm install'))} (or pnpm install, etc)`);
	console.log(`\nStuck? Visit us at ${cyan('https://github.com/loewen-digital/frontend-scaffold/issues')}\n`);
}

main();
