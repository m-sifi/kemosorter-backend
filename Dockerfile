FROM node:16

# create app directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

# bundle app source
COPY . .

EXPOSE 5000
CMD [ "node", "app/main.js" ]