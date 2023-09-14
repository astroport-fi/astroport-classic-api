## ⚠️ Deprecation and maintenace

This repository is no longer actively maintained by Astroport. It will continue to be here on GitHub and freely available for anyone to fork and use, but we will not be actively monitoring or replying to issues and pull requests.

This project was set up with [serverless framework](http://serverless.com/).

## Setting up development environment

### Setup

Install packages

```
npm install
```

Copy .env.sample to .env for local development, by default only the GraphQL function is enabled

```
cp .env.sample .env
```

### Mongodb setup

Restore backup dynamodb dump.

[Download Zip file](https://astroport-classic-mongodb-dump.s3.eu-west-1.amazonaws.com/astroport-classic-mongodb.zip)

Unzip and follow the instructions in the readme to restore mongodb. 
Once you have your database running setup the following environment variables with your table name.

Example for localhost:

```
MONGODB_URL_RW="mongodb://localhost:27017/astroport"
MONGODB_URL_R="mongodb://localhost:27017/astroport"
```

### Running functions

```
npm run dev
```

### Running tests

With a local `.env`

```
npm run test
```

Without a local `.env`

```
npm run test-dev
```

### Adding constants

All non-secret constants must be defined in `src/environment/development.ts`
and `src/environment/production.ts`

If something _needs_ to be read from environment variables, add it to
`.env.dev` and `.env.prod` and use `process.env.VAR_NAME` in constants to
read it in

### Adding secrets

Secrets must be defined in GitHub and added to `.env.dev` and `.env.prod`
at build time using the following

```
echo -e 'NEW_SECRET="${{ secrets.NEW_SECRET_NAME }}"' >> .env.{dev,prod}
```

After adding it, they must be defined in `src/environment/development.ts`
and `src/environment/production.ts` using `process.env.VAR_NAME`

### Running unit tests

- copy .env.development to .env.local and add MONGODB_URL="...."
- Mocha config
  - add configuration to mocharc.js, config options available [here](https://github.com/mochajs/mocha/blob/master/example/config/.mocharc.js)
  - add global hooks (that run before after all tests) in test/hook.ts

### Running unit tests (Webstorm)

- Mocha config
  - environment variables: DOTENV_CONFIG_PATH=.env.local
  - extra mocha options : --require ts-node/register --require dotenv/config --timeout 60000
