# Use Node.js LTS image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY api/package.json api/package-lock.json ./
RUN npm install

# Copy application code
COPY api/ .

# Expose the backend port
EXPOSE 5000

# Command to run the server
CMD ["npm", "start"]
