# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Production stage
FROM node:18-alpine

WORKDIR /app

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Copy from build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/index.js ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the application
CMD ["node", "index.js"]
