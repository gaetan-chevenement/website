import path from 'path';
// import colorFunction from 'postcss-color-function';

const reactToolboxPath = path.resolve('./node_modules', 'react-toolbox');

export default (config, env, helpers) => {
	// Use postcss for every css in react-toolbox module
	const postcssRules = helpers.getLoadersByName(config, 'postcss-loader');
	const cssModulesRule = postcssRules[0].rule;
	cssModulesRule.include.push(reactToolboxPath); // this enables css modules for react-toolbox
	// cssModulesRule.loader.options = { plugins: { 'postcss-color-function': {} } };
	const globalCssRule = postcssRules[1].rule;
	// globalCssRule.loader.options = { plugins: { 'postcss-color-function': {} } };
	globalCssRule.exclude.push(reactToolboxPath); // exclude react-toolbox from global css
};