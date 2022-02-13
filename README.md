# Astroport API

## Development

- npm install
- npm run dev

Adding new env variables (non-secrets)
- add to .env.development or .env.production
- add to serverless.yml - provider.environment.NEW_ENV_VAR

Adding new env variables (secrets)
- add to github secrets
  - echo -e 'NEW_SECRET="${{ secrets.NEW_SECRET_NAME }}"' >> .env
