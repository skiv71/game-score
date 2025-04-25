FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

WORKDIR /app/dist

ENTRYPOINT [ "node", "index.js" ]
