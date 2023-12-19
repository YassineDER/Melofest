FROM node:alpine

# Create app directory
RUN mkdir -p /home/node/app/node_modules

# Set working directory
WORKDIR /home/node/app

# Copy package.json and package-lock.json separately to avoid permission issues
COPY package*.json ./

# Install dependencies as root
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 5000

# Command to run the application
CMD ["node", "index.js"]
