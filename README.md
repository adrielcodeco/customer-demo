# Customers API

[![codecov](https://codecov.io/gh/adrielcodeco/customer-demo/branch/develop/graph/badge.svg?token=rdlj9hy3im)](https://codecov.io/gh/adrielcodeco/customer-demo)

Demo API

The demo is available at [https://customers-api-demo.co2lab.info](https://customers-api-demo.co2lab.info)

## Installation

```bash
$ pnpm i
```

## Building

```bash
$ pnpm run build
```

## Running the app locally

To run the app locally you will need a redis running on localhost:6379.

If your redis is not running on this host or port you can change the redis host and port
within the .env file setting the keys REDIS_HOST and REDIS_PORT.

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Running the app on docker

```bash
$ docker compose run -p 8000:80 --build demo
```

## Running the tests locally

```bash
# all tests without coverage
$ pnpm run test

# tests with coverage
$ pnpm run test:cov
```

## Running the tests on docker

```bash
$ docker compose run --build demo-test
```

## Deploy to production

This project follow the [gitflow concept](https://danielkummer.github.io/git-flow-cheatsheet/) by
the convenience of being well known.

Follow the gitflow to send your changes to production.

The pipelines are automated, the application will be deployed to production if the code are merged to
the main branch.

The automation run a terraform that deploy a AWS App Runner service.

## Teste coverage

[![codecov](https://codecov.io/gh/adrielcodeco/customer-demo/branch/develop/graph/badge.svg?token=rdlj9hy3im)](https://codecov.io/gh/adrielcodeco/customer-demo)

[![codecov](https://codecov.io/gh/adrielcodeco/customer-demo/branch/develop/graphs/sunburst.svg?token=rdlj9hy3im)](https://codecov.io/gh/adrielcodeco/customer-demo)
