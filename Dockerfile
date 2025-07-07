FROM alpine:latest

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN chmod +x *.sh

ENTRYPOINT [ "./start.sh" ]
