# Customers API

[![codecov](https://codecov.io/gh/adrielcodeco/customer-demo/branch/develop/graph/badge.svg?token=rdlj9hy3im)](https://codecov.io/gh/adrielcodeco/customer-demo)

Demo API

The demo is available at [https://customers-api-demo.co2lab.info/api](https://customers-api-demo.co2lab.info/api)

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

You can run redis on docker with the below command:

```bash
$ docker compose run -p 6379:6379 -d cache
```

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

## Using the apis

After running the application you can open in browser E.g.:

```txt
http://localhost:8000/api
```

On /api the application will show a OpenAPI page.

For test purpose you will need a access token.
To get a access token use the below curl E.g.:

```bash
$ curl --location 'https://accounts.seguros.vitta.com.br/auth/realms/careers/protocol/openid-connect/token' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'grant_type=client_credentials' \
    --data-urlencode 'client_id=customers' \
    --data-urlencode 'client_secret=453000f7-47a0-4489-bc47-891c742650e2' \
    --data-urlencode 'username=adrielcodeco@hotmail.com' \
    --data-urlencode 'password=YWRyaWVsY29kZWNvQGhvdG1haWwuY29t' \
    --data-urlencode 'scope=openid'
```

after obtained the access token you can call the customers API to save a customer with the below curl E.g.:

```bash
$ curl --location 'http://localhost:8000/customers' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyTGYtamFReXZmQTNCN3dpVHZ3VkxhMjV1cHhiXzUtQXhZSDhmY3kySHhVIn0.eyJleHAiOjE2ODk0NTEyNzYsImlhdCI6MTY4OTQ1MDk3NiwianRpIjoiNmQ1Y2U3ZjctMDRkNC00ZDQ2LWEzNjktMjc0MzQ3Nzc0ZmQyIiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zZWd1cm9zLnZpdHRhLmNvbS5ici9hdXRoL3JlYWxtcy9jYXJlZXJzIiwic3ViIjoiNzk0ZmFkNjktMzkxNy00OThmLThhNjUtMWVjZGU5NjlmMGRiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY3VzdG9tZXJzIiwiYWNyIjoiMSIsInJlc291cmNlX2FjY2VzcyI6eyJjdXN0b21lcnMiOnsicm9sZXMiOlsidXNlciJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJjbGllbnRJZCI6ImN1c3RvbWVycyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjEwLjUwLjMuMjAyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWN1c3RvbWVycyIsImNsaWVudEFkZHJlc3MiOiIxMC41MC4zLjIwMiJ9.buubr50Skm7iAelx7DWKj3JJh5c6_ltjLmpFZusEXXfVvCvMJJemWXAsXW5D7k3Ovii40NrPb_inWlg5ubdYq5brVscv6u7h8lln9GQXkhXJ7U52CEgMrkuGry_te4lseebDVvn290jF6k28iHZGoJDnWsEtCAGScbj4QQp3Gh_Uq5Ft6CPfwzEMMAUg8EP590LDfxsbpbCUOzE9Tb2eMpXzyWshCREvZhS-QRH-wSVRfHgz69HHUEtl0gSJYdtixLCjkZ1zlIVoCBqFb5IddxObDjigXrFcUh1KRmcnvcmFLs7tpuGmj5A4p83PBPeU6g-KLkyCwfh8EQAkjV9YwQ' \
    --data '{
        "document": 69050007015,
        "name": "John Doe"
    }'
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
