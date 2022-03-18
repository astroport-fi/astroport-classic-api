# Astroport API

### Development

In order to run this repo, you can do the following:

```
npm install
npm run dev
```

### Adding new env variables (non-secrets)

- Add to .env.development or .env.production
- Add to serverless.yml - provider.environment.NEW_ENV_VAR

### Running unit tests (Webstorm)

- Copy .env.development to .env.local and add MONGODB_URL="..."
- Mocha config
  - Environment variables: ```DOTENV_CONFIG_PATH=.env.local```
  - EXxtra mocha options: ```--require ts-node/register --require dotenv/config --timeout 60000```
  
### Adding new env variables (non-secrets)

- Add to __.env.development__ or __.env.production__
- Add to __serverless.yml__ - __provider.environment.NEW_ENV_VAR__

### Adding new env variables (secrets)

- Add to github secrets:
 ```echo -e 'NEW_SECRET="${{ secrets.NEW_SECRET_NAME }}"' >> .env```
