FROM node:12

ADD . /src

WORKDIR /src

COPY package*.json ./

COPY init.sql /docker-entrypoint-initdb.d/

RUN npm install
