FROM node:latest

WORKDIR /app

COPY src .

COPY package.json .

COPY tsconfig.json .

RUN npm install

RUN npm run build

ENTRYPOINT [ "node", "/app/dist/index.js" ]

