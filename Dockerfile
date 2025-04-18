FROM node:latest

WORKDIR /app

COPY src .

COPY package.json .

COPY tsconfig.json .

RUN npm install

RUN npm run build

WORKDIR /dist

ENTRYPOINT [ "node", "index.js" ]

