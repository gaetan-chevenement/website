module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'jsx': true
    }
  },
  extends: [
    'eslint-config-synacor',
    'plugin:promise/recommended',
  ],
  plugins: [
    'babel',
    'react',
    'mocha',
    'import',
    'promise'
  ],
  settings: {
    'import/resolver': 'babel-root-import',
    'import/ignore': [
      'webpack.config.json'
    ]
  },
  env: {
    'browser': true,
    'amd': true,
    'es6': true,
    'node': true,
    'mocha': true
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2],
    'key-spacing': ['error', { mode: 'minimum' }],

    'react/jsx-indent-props': ['error', 2],

    'no-console': ['warn'],
  },
};
