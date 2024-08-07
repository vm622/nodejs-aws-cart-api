FROM node:20-alpine AS build
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install --force
COPY . .
RUN npm run build 

FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist .
EXPOSE 4000
USER node
CMD [ "node", "main.js" ]
