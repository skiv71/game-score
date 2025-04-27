FROM alpine@sha256:a8560b36e8b8210634f77d9f7f9efd7ffa463e380b75e2e74aff4511df3ef88c

RUN apk update \
    && apk add --no-cache nodejs npm

WORKDIR /tmp

# RUN wget ${NODE}

# RUN tar -zxvf *.gz

# RUN cd node* \
#     && cp -R . /usr/local

# RUN ls /usr/local/bin

RUN node -v

# WORKDIR /app

# COPY . .

# RUN npm install

# RUN npm run build

# RUN chmod +x *.sh

ENTRYPOINT [ "./start.sh" ]
