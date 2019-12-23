FROM node:12.14.0-alpine@sha256:0752e7cff423af6972af4ed59e1d98694008371cd8ffeed0ee3e2b3f94b3c6b3 as builder
WORKDIR /app
COPY ./frontend /app
RUN npm install
RUN npm run build --production

FROM node:12.14.0-alpine@sha256:0752e7cff423af6972af4ed59e1d98694008371cd8ffeed0ee3e2b3f94b3c6b3 as builder
COPY --from=builder /app/build /app/build
COPY ./config /app/config
COPY ./src /app/src
COPY ./index.js /app/index.js
COPY ./package-lock.json /app/package-lock.json
COPY ./package.json /app/package.json
COPY ./LICENSE.md /app/LICENSE.md
RUN npm install --production

EXPOSE 80

ENTRYPOINT [ "node index.js" ]
