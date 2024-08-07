FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install --force
COPY . .
RUN npm run build 
EXPOSE 4000
USER node
CMD [ "node", "dist/main.js" ]
