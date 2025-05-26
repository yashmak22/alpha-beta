# Alpha Platform

Alpha is a full-stack, microservices-based platform for building, running, and evaluating LLM-driven agents. It provides a comprehensive suite of tools for prompt management, agent orchestration, memory management, and tool integrations.

## System Architecture

![Alpha Platform Architecture](docs/images/architecture.png)

- **Microservices Architecture**: Modular, independently deployable services
- **Event-Driven Communication**: Kafka for asynchronous communication between services
- **GraphQL API**: Primary interface for frontend-to-backend communication
- **Containerization**: Docker containers orchestrated with Kubernetes
- **CI/CD**: Automated build and deployment with GitHub Actions and Netlify

## Project Structure

```
/alpha-beta
├── dashboard/               # Next.js + React + TypeScript + Chakra UI frontend
├── agent-service/           # NestJS microservice for agent orchestration
├── prompt-service/          # NestJS microservice for prompt management
├── memory-service/          # FastAPI microservice for memory management
├── tools-service/           # FastAPI microservice for tools integration
├── k8s/                     # Kubernetes manifests for deployment
│   ├── base/                # Base Kubernetes configurations
│   └── overlays/            # Environment-specific overlays
│       ├── dev/             # Development environment
│       └── prod/            # Production environment
├── docker-compose.yml       # Local development setup
└── .github/workflows/       # CI/CD pipeline configuration
    └── netlify-deploy.yml   # Netlify deployment workflow
```

## Microservices

### Agent Service

The Agent Service manages agent definitions, capabilities, and sessions. It's built with NestJS and exposes a GraphQL API.

**Key Features:**
- Agent CRUD operations
- Session management

## Deployment

### Dashboard (Frontend)

The Alpha Platform dashboard is deployed using Netlify with continuous deployment from GitHub.

#### Netlify Deployment Setup

1. **Create a Netlify Site**:
   - Go to [Netlify](https://app.netlify.com/) and sign up/login
   - Click "New site from Git"
   - Connect to your GitHub repository
   - Configure build settings:
     - Base directory: `dashboard`
     - Build command: `npm run build`
     - Publish directory: `.next`

2. **Configure Environment Variables**:
   - In Netlify site settings, go to "Environment variables"
   - Add the necessary environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://api.your-domain.com
     NEXT_PUBLIC_APP_URL=https://your-domain.com
     NEXT_PUBLIC_STORAGE_TYPE=remote
     ```

3. **Configure GitHub Secrets**:
   - In your GitHub repository settings, go to "Secrets and variables" → "Actions"
   - Add the following secrets:
     ```
     NETLIFY_AUTH_TOKEN=your_netlify_auth_token
     NETLIFY_SITE_ID=your_netlify_site_id
     ```

4. **Enable Identity Service** (for authentication):
   - In your Netlify site settings, go to "Identity"
   - Click "Enable Identity"
   - Configure registration preferences
   - Enable Git Gateway for CMS integration (if needed)

### Continuous Deployment

With the GitHub Actions workflow setup in `.github/workflows/netlify-deploy.yml`, the following CI/CD process is enabled:

- **On Push to Main**: Automatically builds and deploys to production
- **On Pull Request**: Creates a preview deployment for review
- **Quality Checks**: Runs TypeScript checks, linting, and tests before deployment

Each deployment includes:
- Build process validation
- Preview URLs for PRs
- Deployment notifications in GitHub
- Event-driven communication with Kafka

### Prompt Service

The Prompt Service manages prompts, templates, and prompt versions. It's built with NestJS and exposes a GraphQL API.

**Key Features:**
- Prompt CRUD operations
- Versioning and tagging
- Template management

### Memory Service

The Memory Service manages different types of memory for agents. It's built with FastAPI and utilizes Milvus for vector storage and Neo4j for graph representation.

**Key Features:**
- Vector memory with Milvus
- Graph memory with Neo4j
- Session memory caching with Redis

### Tools Service

The Tools Service manages tool definitions, registrations, and executions. It's built with FastAPI and uses MongoDB for tool registrations.

**Key Features:**
- Tool registration and discovery
- Tool execution with validation
- Authentication and authorization for tools

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.10+
- Docker and Docker Compose
- Kubernetes cluster (for production deployment)

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/alpha-beta.git
   cd alpha-beta
   ```

2. Start the services with Docker Compose:
   ```bash
   docker-compose up
   ```

3. Access the services:
   - Dashboard: http://localhost:3000
   - Agent Service: http://localhost:3001/graphql
   - Prompt Service: http://localhost:3002/graphql
   - Memory Service: http://localhost:3003/docs
   - Tools Service: http://localhost:3004/docs

### Individual Service Setup

Alternatively, you can run each service individually:

#### Agent Service
```bash
cd agent-service
npm install
npm run start:dev
```

#### Prompt Service
```bash
cd prompt-service
npm install
npm run start:dev
```

#### Memory Service
```bash
cd memory-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

#### Tools Service
```bash
cd tools-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python src/main.py
```

## Deployment

### Kubernetes Deployment

The platform can be deployed to Kubernetes using the provided manifests:

1. For development:
   ```bash
   kubectl apply -k k8s/overlays/dev
   ```

2. For production:
   ```bash
   kubectl apply -k k8s/overlays/prod
   ```

### CI/CD Pipeline

The platform includes a GitHub Actions workflow for CI/CD:

1. Push to the `develop` branch to deploy to the development environment
2. Push to the `main` branch to deploy to the production environment

## Data Stores

- **PostgreSQL**: Used by agent-service and prompt-service for structured data
- **MongoDB**: Used by tools-service for tool registrations
- **Redis**: Used for caching and session management
- **Milvus**: Vector database for semantic search in memory-service
- **Neo4j**: Graph database for relational memory in memory-service

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
