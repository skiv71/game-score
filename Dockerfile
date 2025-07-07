FROM debian:12-slim

RUN apt-get update \
    && apt install -y curl

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash

RUN apt-get install -y nodejs

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN chmod +x *.sh

ENTRYPOINT [ "./start.sh" ]
