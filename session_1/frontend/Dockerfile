FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Create src directory (will be mounted in development)
RUN mkdir -p src

# Copy configuration files
COPY angular.json ./
COPY tsconfig*.json ./

# Expose port
EXPOSE 4200

# Start development server with host binding for hot reload
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]