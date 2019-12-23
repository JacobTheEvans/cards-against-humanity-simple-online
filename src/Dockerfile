FROM node:12.14.0-alpine@sha256:0752e7cff423af6972af4ed59e1d98694008371cd8ffeed0ee3e2b3f94b3c6b3 AS build-stage

RUN apk add --update --no-cache git && rm -rf /tmp/*

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

FROM node:12.14.0-alpine@sha256:0752e7cff423af6972af4ed59e1d98694008371cd8ffeed0ee3e2b3f94b3c6b3

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --from=build-stage /home/node/app/node_modules /home/node/app/node_modules

COPY --chown=node:node . .

EXPOSE 8080

ENTRYPOINT ["node", "index.js"]
CMD []
