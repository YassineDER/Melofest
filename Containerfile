FROM node:lts as runner
WORKDIR /node-express
ENV NODE_ENV production
COPY . .
RUN npm ci --only=production
EXPOSE 5000
CMD ["node", "app.js"]