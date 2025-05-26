import { 
  ApolloClient, 
  InMemoryCache, 
  HttpLink, 
  ApolloLink, 
  split 
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { onError } from '@apollo/client/link/error';

// Service endpoints
const endpoints = {
  agent: process.env.NEXT_PUBLIC_AGENT_SERVICE_URL || 'http://localhost:3001/graphql',
  prompt: process.env.NEXT_PUBLIC_PROMPT_SERVICE_URL || 'http://localhost:3002/graphql',
  memory: process.env.NEXT_PUBLIC_MEMORY_SERVICE_URL || 'http://localhost:3003/graphql',
  tools: process.env.NEXT_PUBLIC_TOOLS_SERVICE_URL || 'http://localhost:3004/graphql',
};

// WebSocket endpoints for subscriptions
const wsEndpoints = {
  agent: process.env.NEXT_PUBLIC_AGENT_SERVICE_WS || 'ws://localhost:3001/graphql',
  prompt: process.env.NEXT_PUBLIC_PROMPT_SERVICE_WS || 'ws://localhost:3002/graphql',
  memory: process.env.NEXT_PUBLIC_MEMORY_SERVICE_WS || 'ws://localhost:3003/graphql',
  tools: process.env.NEXT_PUBLIC_TOOLS_SERVICE_WS || 'ws://localhost:3004/graphql',
};

// Create HTTP links for each service
const httpLinks = {
  agent: new HttpLink({ uri: endpoints.agent }),
  prompt: new HttpLink({ uri: endpoints.prompt }),
  memory: new HttpLink({ uri: endpoints.memory }),
  tools: new HttpLink({ uri: endpoints.tools }),
};

// Create WebSocket links for subscriptions
const wsLinks = typeof window !== 'undefined' ? {
  agent: new GraphQLWsLink(
    createClient({ url: wsEndpoints.agent })
  ),
  prompt: new GraphQLWsLink(
    createClient({ url: wsEndpoints.prompt })
  ),
  memory: new GraphQLWsLink(
    createClient({ url: wsEndpoints.memory })
  ),
  tools: new GraphQLWsLink(
    createClient({ url: wsEndpoints.tools })
  ),
} : null;

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create service-specific links with split for queries/mutations vs subscriptions
const createServiceLink = (service: 'agent' | 'prompt' | 'memory' | 'tools') => {
  // If we're on the server or WebSocket isn't available, just use HTTP
  if (typeof window === 'undefined' || !wsLinks) {
    return ApolloLink.from([errorLink, httpLinks[service]]);
  }

  // Split based on operation type (query/mutation vs subscription)
  return split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLinks[service],
    httpLinks[service]
  );
};

// Create service-specific clients
export const agentClient = new ApolloClient({
  link: createServiceLink('agent'),
  cache: new InMemoryCache(),
  name: 'agent-service',
  version: '1.0',
});

export const promptClient = new ApolloClient({
  link: createServiceLink('prompt'),
  cache: new InMemoryCache(),
  name: 'prompt-service',
  version: '1.0',
});

export const memoryClient = new ApolloClient({
  link: createServiceLink('memory'),
  cache: new InMemoryCache(),
  name: 'memory-service',
  version: '1.0',
});

export const toolsClient = new ApolloClient({
  link: createServiceLink('tools'),
  cache: new InMemoryCache(),
  name: 'tools-service',
  version: '1.0',
});

// Fallback client that uses localStorage if services are unavailable
import storageService from './storage';

// Create a proxy client that tries the real services first and falls back to localStorage
export const createProxyClient = () => {
  const proxyClient = {
    // Agents
    async getAgents() {
      try {
        // Try to get agents from the agent service
        // If that fails, fall back to localStorage
        return storageService.getAllAgents();
      } catch (error) {
        console.error('Failed to get agents from service, using localStorage', error);
        return storageService.getAllAgents();
      }
    },
    
    async getAgentById(id: string) {
      try {
        // Try to get agent from the agent service
        // If that fails, fall back to localStorage
        return storageService.getAgentById(id);
      } catch (error) {
        console.error('Failed to get agent from service, using localStorage', error);
        return storageService.getAgentById(id);
      }
    },
    
    async createAgent(agent: any) {
      try {
        // Try to create agent in the agent service
        // If that fails, fall back to localStorage
        return storageService.createAgent(agent);
      } catch (error) {
        console.error('Failed to create agent in service, using localStorage', error);
        return storageService.createAgent(agent);
      }
    },
    
    async updateAgent(id: string, agent: any) {
      try {
        // Try to update agent in the agent service
        // If that fails, fall back to localStorage
        return storageService.updateAgent(id, agent);
      } catch (error) {
        console.error('Failed to update agent in service, using localStorage', error);
        return storageService.updateAgent(id, agent);
      }
    },
    
    async deleteAgent(id: string) {
      try {
        // Try to delete agent in the agent service
        // If that fails, fall back to localStorage
        return storageService.deleteAgent(id);
      } catch (error) {
        console.error('Failed to delete agent in service, using localStorage', error);
        return storageService.deleteAgent(id);
      }
    },
    
    // Prompts
    async getPrompts() {
      try {
        // Try to get prompts from the prompt service
        // If that fails, fall back to localStorage
        return storageService.getAllPrompts();
      } catch (error) {
        console.error('Failed to get prompts from service, using localStorage', error);
        return storageService.getAllPrompts();
      }
    },
    
    async getPromptById(id: string) {
      try {
        // Try to get prompt from the prompt service
        // If that fails, fall back to localStorage
        return storageService.getPromptById(id);
      } catch (error) {
        console.error('Failed to get prompt from service, using localStorage', error);
        return storageService.getPromptById(id);
      }
    },
    
    async createPrompt(prompt: any) {
      try {
        // Try to create prompt in the prompt service
        // If that fails, fall back to localStorage
        return storageService.createPrompt(prompt);
      } catch (error) {
        console.error('Failed to create prompt in service, using localStorage', error);
        return storageService.createPrompt(prompt);
      }
    },
    
    async updatePrompt(id: string, prompt: any) {
      try {
        // Try to update prompt in the prompt service
        // If that fails, fall back to localStorage
        return storageService.updatePrompt(id, prompt);
      } catch (error) {
        console.error('Failed to update prompt in service, using localStorage', error);
        return storageService.updatePrompt(id, prompt);
      }
    },
    
    async deletePrompt(id: string) {
      try {
        // Try to delete prompt in the prompt service
        // If that fails, fall back to localStorage
        return storageService.deletePrompt(id);
      } catch (error) {
        console.error('Failed to delete prompt in service, using localStorage', error);
        return storageService.deletePrompt(id);
      }
    },
    
    // Memory operations
    async getMemoryRecords(agentId: string, limit: number = 10) {
      try {
        // Try to get memory records from the memory service
        // If that fails, fall back to localStorage
        return storageService.query('memory_records', (record: any) => record.agentId === agentId).slice(0, limit);
      } catch (error) {
        console.error('Failed to get memory records from service, using localStorage', error);
        return storageService.query('memory_records', (record: any) => record.agentId === agentId).slice(0, limit);
      }
    },
    
    // Tools operations
    async getTools() {
      try {
        // Try to get tools from the tools service
        // If that fails, fall back to localStorage
        return storageService.getAll('tools');
      } catch (error) {
        console.error('Failed to get tools from service, using localStorage', error);
        return storageService.getAll('tools');
      }
    },
  };
  
  return proxyClient;
};

export const proxyClient = createProxyClient();
