FROM node:alpine

EXPOSE 5001

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# RUN npm run commands

CMD ["node", "./dist/server/index.js"]