// const fs = require('fs');
// const path = require('path');

// const {
//   buildASTSchema,
//   getIntrospectionQuery,
//   graphqlSync,
//   parse,
// } = require('graphql');

// const typeDefinition = fs.readFileSync(
//   path.join(__dirname, 'schema-public.graphql'),
//   'utf8'
// );
// const schema = buildASTSchema(parse(typeDefinition));

module.exports = {
  extends: ['eslint-config-typescript'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  overrides: [
    {
      files: ['src/test-setup.ts'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    },
    {
      files: ['src/common/generatedGraphqlTypes.ts'],
      rules: {
        'max-len': 0,
        'no-shadow': 0,
        '@typescript-eslint/indent': 0,
      },
    },
    {
      files: ['*.tsx', '*.ts', '*.jsx', '*.js'],
      processor: '@graphql-eslint/graphql',
    },
    {
      files: ['*.graphql'],
      parser: '@graphql-eslint/eslint-plugin',
      plugins: ['@graphql-eslint'],
      // parserOptions: {
      //   schema: './schema-public.graphql',
      // },
      rules: {
        '@graphql-eslint/no-unreachable-types': ['error'],
      },
    },
  ],

  rules: {
    // 'graphql/template-strings': [
    //   'error',
    //   {
    //     env: 'relay',
    //     tagName: 'graphql',
    //     schemaJson: graphqlSync(schema, getIntrospectionQuery()),
    //   },
    // ],
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/naming-convention': 0,
    'import/no-named-as-default': 0,
    'operator-linebreak': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
    'react/static-property-placement': 0,
    'no-ternary': 0,
  },
};
