module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      features: {
        customProperties: {
          variables: require('./src/style/variables.js').default,
        },
      },
    },
  },
};
