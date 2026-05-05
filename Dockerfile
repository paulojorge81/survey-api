FROM node:24
WORKDIR /usr/api/survey-api
RUN corepack enable
COPY ./package.json .
COPY ./pnpm-lock.yaml .
RUN pnpm i --prod --frozen-lockfile --ignore-scripts
COPY ./dist ./dist
