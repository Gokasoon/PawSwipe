# Use Node.js LTS image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application code
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight web server
RUN npm install -g serve

# Expose the frontend port
EXPOSE 3000

# Command to serve the build
CMD ["serve", "-s", "build"]
