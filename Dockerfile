FROM node:16

# create app directory
WORKDIR /usr/src/

# install dependencies
COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

# bundle app source
COPY app/ .

EXPOSE 5000
CMD [ "node", "main.js" ]
