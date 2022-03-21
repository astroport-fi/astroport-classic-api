# Astroport API

### Development

- npm install
- npm run dev

Adding new env variables (non-secrets)
- add to .env.development or .env.production
- add to serverless.yml - provider.environment.NEW_ENV_VAR

### Running unit tests (Webstorm)
- copy .env.development to .env.local and add MONGODB_URL="..."
- Mocha config
  - environment variables: DOTENV_CONFIG_PATH=.env.local
  - extra mocha options  : --require ts-node/register --require dotenv/config --timeout 60000
  
### Adding new env variables (non-secrets)
- add to .env.development or .env.production
- add to serverless.yml - provider.environment.NEW_ENV_VAR

### Adding new env variables (secrets)
- add to github secrets
- echo -e 'NEW_SECRET="${{ secrets.NEW_SECRET_NAME }}"' >> .env
- add to constants
