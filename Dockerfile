FROM node:24
WORKDIR /usr/api/survery-api
RUN corepack enable
COPY ./package.json .
COPY ./pnpm-lock.yaml .
RUN pnpm i --prod --frozen-lockfile --ignore-scripts
COPY ./dist ./dist
EXPOSE 5050
CMD ["pnpm", "start"]
