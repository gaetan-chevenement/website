// // All this code was supposed to help customize the theme of
// // react-toolbox. It never worked.
// const Promise       = require('bluebird');
// const ExtractValues = require('modules-values-extract');
//
// const config = {
//   plugins: {
//     'postcss-cssnext': {
//       features: {
//         customProperties: {
//           variables: {},
//         },
//       },
//     },
//     'postcss-modules-values': {},
//   },
// };
//
// module.exports = Promise.resolve(ExtractValues({
//   files: [
//     require.resolve('react-toolbox/lib/colors.css'),
//     require.resolve('react-toolbox/lib/variables.css'),
//   ],
//   plugins: [require('postcss-next')],
// })).tap((vars) => {
//   console.log(vars);
//   config.plugins['postcss-cssnext'].features.customProperties.variables = vars;
// }).thenReturn(config);

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {},
  },
};
