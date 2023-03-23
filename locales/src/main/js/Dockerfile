FROM node:17

WORKDIR /usr/locales

RUN mkdir /usr/locales/logs/ && touch /usr/locales/logs/out.log && chown -R node /usr/locales/logs/

COPY package*.json ./

RUN npm install

USER node

COPY ./dist .

EXPOSE 8080

CMD [ "node", "./server.js" ]