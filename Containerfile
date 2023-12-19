FROM node:alpine
WORKDIR /node-express
COPY . .
RUN npm install
EXPOSE 5000
CMD ["node", "index.js"]
