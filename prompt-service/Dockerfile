# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Set environment variables
ENV PORT=3002
ENV NODE_ENV=production

# Copy only necessary files from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Install wget for healthcheck
RUN apk add --no-cache wget

# Expose the port
EXPOSE 3002

# Healthcheck to ensure service is running properly
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1

# Run the application
CMD ["node", "dist/main"]
