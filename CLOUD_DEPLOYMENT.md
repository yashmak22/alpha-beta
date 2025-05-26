# Alpha Platform Cloud Deployment Guide

This guide walks through deploying the Alpha Platform to cloud services, eliminating all local dependencies.

## Architecture Overview

The Alpha Platform uses a microservices architecture deployed to cloud services:

- **Frontend**: Netlify (already deployed)
- **Database/Auth/Storage**: Supabase
- **Microservices**: Render.com
- **Cache/Pub-Sub**: Upstash Redis

## Prerequisites

1. [Supabase](https://supabase.com) account
2. [Render.com](https://render.com) account
3. [Upstash](https://upstash.com) account for Redis
4. GitHub repository with your Alpha Platform code

## Step 1: Set Up Supabase

1. Create a new Supabase project
2. Go to SQL Editor and run the `supabase-schema.sql` script to create all necessary tables
3. Run the `memory-service/scripts/vector_functions.sql` script to create vector search functions
4. Copy your Supabase URL and API keys (anon key and service role key)

## Step 2: Set Up Upstash Redis

1. Create a new Redis database in Upstash
2. Copy the Redis connection string and password

## Step 3: Deploy Microservices to Render.com

### Option A: Deploy using render.yaml (Recommended)

1. Update the `render.yaml` file with your GitHub repository URL
2. Login to Render.com and go to the Dashboard
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will detect the `render.yaml` and create all services
6. Configure environment variables in Render Dashboard for each service:
   - SUPABASE_URL
   - SUPABASE_KEY
   - SUPABASE_SERVICE_KEY
   - REDIS_URL
   - REDIS_PASSWORD
   - API_KEY (for service-to-service communication)
   - Other service-specific environment variables

### Option B: Manual Deployment

1. Login to Render.com and go to the Dashboard
2. For each service (agent, prompt, memory, tools, evaluation, api-gateway):
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure settings (name, branch, build command, start command)
   - Set environment variables
   - Deploy

## Step 4: Update Frontend Configuration

1. Update the frontend environment variables in Netlify:
   - NEXT_PUBLIC_API_URL: URL of your API Gateway on Render
   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon key
   - NEXT_PUBLIC_AUTH_PROVIDER: "supabase"
   - NEXT_PUBLIC_STORAGE_TYPE: "supabase"

2. Trigger a new build in Netlify to apply these changes

## Step 5: Set Up Continuous Deployment

1. Ensure your GitHub repository is connected to Netlify and Render
2. Both services will automatically deploy on new commits to your main branch

## Environment Variables Reference

### API Gateway
```
PORT=8080
NODE_ENV=production
API_KEY=your-api-key-here
AGENT_SERVICE_URL=https://alpha-agent-service.onrender.com
PROMPT_SERVICE_URL=https://alpha-prompt-service.onrender.com
MEMORY_SERVICE_URL=https://alpha-memory-service.onrender.com
TOOLS_SERVICE_URL=https://alpha-tools-service.onrender.com
EVALUATION_SERVICE_URL=https://alpha-evaluation-service.onrender.com
```

### Agent Service
```
PORT=3001
NODE_ENV=production
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
REDIS_URL=your-redis-url
REDIS_PASSWORD=your-redis-password
API_KEY=your-api-key
```

### Other Services
Each service requires similar environment variables with service-specific settings.

## Troubleshooting

### Health Checks
- All services have `/health` endpoints to check their status
- The API Gateway aggregates health information from all services

### Logs
- Check service logs in the Render.com dashboard
- Supabase has SQL query logs for database operations

### Common Issues
- **CORS Errors**: Ensure CORS is properly configured in each service
- **Authentication Failures**: Check API keys and Supabase credentials
- **Database Connection Issues**: Verify database connection strings
- **Memory Errors**: Monitor resource usage in Render dashboard

## Migration from Local Development

If you were previously using Docker Compose for local development (as per your memory), the transition to cloud services maintains the same architecture but replaces:

- Local PostgreSQL → Supabase PostgreSQL
- Local Redis → Upstash Redis
- Local Milvus → Supabase pgvector
- Local services → Render.com web services

Your local development setup at http://localhost:3005 can still be used for development, while the cloud deployment provides a production environment with no local dependencies.
