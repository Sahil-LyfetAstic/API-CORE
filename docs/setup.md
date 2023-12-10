
# Setup

[Back to docs](./index.md)


```

Note: Make sure to pull latest changes once in a week

## Installation

```bash
$ npm install
```


## Environment setup

```bash
# create .env file using .env.sample and update env variables
$ cp .env.sample .env
```

## Running the app

```bash
# development
$ npm run start

# production mode
$ npm run prod
```


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# testing a service individually
# create a test script under testers/ folder and run using npx
$ npx ts-node -r tsconfig-paths/register testers/twilio-sendSms.ts
```


## Build & Production

```bash
# build
$ npm run build

# start
$ npm run prod:start

# build and start
$ npm run prod
```
