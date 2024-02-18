FROM node:alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g typescript

RUN npm run setup

RUN npm run build

COPY . .

EXPOSE 5001/tcp

CMD ["node", "./src/server/dist/server/index.js"]
