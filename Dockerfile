FROM node:lts-alpine AS builder-base

WORKDIR /api

RUN apk add --update jq python3 make g++

COPY pnpm-lock.yaml                     .

RUN npm install -g pnpm

RUN pnpm fetch

COPY package.json                       .

FROM builder-base AS build-dev

RUN pnpm install --no-optional --ignore-scripts --prefer-offline --frozen-lockfile

COPY ./src                              ./src
COPY ./tsconfig.json                    .
COPY ./tsconfig.build.json              .

RUN pnpm run build

FROM build-dev AS build-prod

RUN pnpm install --prod --no-optional --ignore-scripts --prefer-offline --frozen-lockfile

FROM node:lts-alpine

WORKDIR /api

COPY --from=build-prod     /api/node_modules     ./node_modules
COPY --from=build-prod     /api/dist             .

ENV PORT 80

EXPOSE 80

CMD node main
