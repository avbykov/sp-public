FROM node:17

WORKDIR /usr/resources

RUN mkdir /usr/resources/logs/ && touch /usr/resources/logs/out.log && chown -R node /usr/resources/logs/

COPY package*.json ./

RUN npm install

USER node

COPY . .

EXPOSE 8080
