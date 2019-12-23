FROM node:12.14.0-alpine@sha256:0752e7cff423af6972af4ed59e1d98694008371cd8ffeed0ee3e2b3f94b3c6b3 as builder
WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build --production

FROM nginx:1.15-alpine@sha256:ae5da813f8ad7fa785d7668f0b018ecc8c3a87331527a61d83b3b5e816a0f03c
COPY --from=builder /app/build /app/web_root/
COPY --from=builder /app/config /app/config/
COPY --from=builder /app/scripts/entrypoint.sh /bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT [ "/bin/entrypoint.sh" ]
