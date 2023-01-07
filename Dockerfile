FROM node

COPY . /home/app

RUN rm -rf /home.app/node_modules

WORKDIR /home/app

RUN npm install

CMD [ "node", "app.js" ]