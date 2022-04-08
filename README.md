# Astroport API

### Development

- npm install
- npm run dev

Adding new env variables (non-secrets)

- add to .env.development or .env.production
- add to serverless.yml - provider.environment.NEW_ENV_VAR

### Running unit tests

- copy .env.development to .env.local and add MONGODB_URL="..."
- Mocha config
  - add configuration to mocharc.js, config options available [here](https://github.com/mochajs/mocha/blob/master/example/config/.mocharc.js)
  - add global hooks (that run before after all tests) in test/hook.ts

### Running unit tests (Webstorm)

- Mocha config
  - environment variables: DOTENV_CONFIG_PATH=.env.local
  - extra mocha options : --require ts-node/register --require dotenv/config --timeout 60000

### Adding new env variables (non-secrets)

- add to .env.development or .env.production
- add to serverless.yml - provider.environment.NEW_ENV_VAR

### Adding new env variables (secrets)

- add to github secrets
- echo -e 'NEW_SECRET="${{ secrets.NEW_SECRET_NAME }}"' >> .env
- add to constants
