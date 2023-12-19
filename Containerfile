FROM node:latest
WORKDIR /node-express
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "index.js"]