FROM node:alpine

EXPOSE 5001/tcp

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

CMD ["node", "./src/server/dist/server/index.js"]