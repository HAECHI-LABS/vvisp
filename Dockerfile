FROM node:11.15.0-alpine AS builder

RUN apk add --update python krb5 krb5-libs gcc make g++ krb5-dev git 

RUN npm i lerna -g --loglevel notice

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

USER node 

COPY --chown=node:node . .

RUN lerna bootstrap

FROM node:11.15.0-alpine

RUN mkdir -p /project && chown -R node:node /project
RUN mkdir -p /app/node_modules && chown -R node:node /app
WORKDIR /home/node/app

COPY --from=builder /home/node/app /app

WORKDIR /project
VOLUME ["/project"]

ENTRYPOINT ["node" , "/app/packages/vvisp/bin/vvisp.js" ]
