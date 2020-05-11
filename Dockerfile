FROM node:8.11

ENV NPM_CONFIG_LOGLEVEL warn
ENV PORT=80
EXPOSE 80

# Build the server
COPY package.json package.json
RUN npm install
COPY . .

# Build the client
RUN npm run client-build

CMD ["npm", "start"]
