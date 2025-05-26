FROM node:16-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV PORT=3002
ENV NODE_ENV=production

# Expose the port
EXPOSE 3002

# Run the application
CMD ["node", "dist/main"]
