> :warning: This branch represents the code running in production at the time of the incident that occurred on 5 May 2022 from 19:30 UTC to 20:30 UTC
> [Incident report](https://www.notion.so/astroport/05-05-2022-8db2c29d2e18467fb023faa237180aa9)

# Astroport API

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

### Local Mongodb setup

Dump development database

```
mongodump --uri mongodb+srv://<username>:<password>@<dev-cluster-host.net>/astroport --out astroport.dev
```

Restore development database locally

```
mongorestore -d astroport ./astroport.dev/astroport -h 127.0.0.1 --port 27050
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

### Testnet wallet

A testnet wallet with limited funds is available for tests. Just drop a message
in the [Slack #backend-internal](https://astrochad.slack.com/archives/C03B289KPDX)
channel to get access to the wallet

## Other configuration options

### Running unit tests

- copy .env.development to .env.local and add MONGODB_URL="..."
- Mocha config
  - add configuration to mocharc.js, config options available [here](https://github.com/mochajs/mocha/blob/master/example/config/.mocharc.js)
  - add global hooks (that run before after all tests) in test/hook.ts

### Running unit tests (Webstorm)

- Mocha config
  - environment variables: DOTENV_CONFIG_PATH=.env.local
  - extra mocha options : --require ts-node/register --require dotenv/config --timeout 60000
