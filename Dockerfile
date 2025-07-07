FROM debian:12-slim

RUN apt-get update \
    && apt install -y wget

RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

RUN nvm install --lts

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN chmod +x *.sh

ENTRYPOINT [ "./start.sh" ]
