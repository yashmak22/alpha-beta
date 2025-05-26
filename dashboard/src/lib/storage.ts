import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

// Define types for our storage system
export interface StorageItem {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Agent extends StorageItem {
  name: string;
  description: string;
  type: 'single' | 'network' | 'supervisor';
  status: 'active' | 'inactive' | 'draft';
  model: string;
  maxTokens: number;
  temperature: number;
  promptTemplate: string;
  enableMemory: boolean;
  enableTools: boolean;
  memoryType?: 'vector' | 'graph' | 'hybrid';
  embeddingModel?: string;
  memoryRetention?: 'conversation' | 'session' | 'permanent';
  tools?: string[];
  systemMessage?: string;
  lastRunId?: string;
}

export interface Prompt extends StorageItem {
  name: string;
  description: string;
  templateType: 'completion' | 'chat' | 'embedding' | 'function';
  content: string;
  tags: string[];
  parameters: Record<string, any>[];
  lastEditedBy: string;
  version: number;
  versions?: { id: string; content: string; createdAt: string }[];
}

export interface Evaluation extends StorageItem {
  name: string;
  agentId: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  date: string;
  score?: number;
  accuracy?: number;
  relevance?: number;
  datasetId: string;
  results?: {
    questionId: string;
    response: string;
    expectedResponse: string;
    score: number;
  }[];
}

export interface Dataset extends StorageItem {
  name: string;
  description?: string;
  source: string;
  format: string;
  recordCount: number;
  filePath?: string;
}

// Extended Evaluation interface for cloud deployment
export interface EvaluationResult extends StorageItem {
  name: string;
  description?: string;
  agentId: string;
  datasetId: string;
  metrics: Record<string, any>;
  status: 'scheduled' | 'in_progress' | 'completed'; // Use consistent status types
  results?: {
    questionId: string;
    response: string;
    expectedResponse: string;
    score: number;
  }[];
}

export interface Tool extends StorageItem {
  name: string;
  description?: string;
  apiSchema: Record<string, any>;
  implementation?: string;
  isActive: boolean;
}

export interface TrainingJob extends StorageItem {
  name: string;
  description?: string;
  baseModel: string;
  datasetIds: string[];
  parameters: Record<string, any>;
  status: string; // pending, running, completed, failed
  progress?: number;
  metrics?: Record<string, any>;
}

// Collections
export const COLLECTIONS = {
  AGENTS: 'agents',
  PROMPTS: 'prompts',
  DATASETS: 'datasets',
  EVALUATIONS: 'evaluations',
  TOOLS: 'tools',
  TRAINING_JOBS: 'training_jobs',
};

// Storage service class for handling data persistence
class StorageService {
  // Safely check if we're in a browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Helper to get collection from localStorage or memory fallback
  private getCollection<T>(collection: string): T[] {
    // Use in-memory storage when not in browser (SSR)
    if (!this.isBrowser()) {
      return [];
    }
    
    const storedData = localStorage.getItem(`alpha_${collection}`);
    return storedData ? JSON.parse(storedData) : [];
  }

  // Helper to save collection to localStorage or memory fallback
  private saveCollection<T>(collection: string, data: T[]): void {
    // Skip saving when not in browser (SSR)
    if (!this.isBrowser()) {
      return;
    }
    
    localStorage.setItem(`alpha_${collection}`, JSON.stringify(data));
  }

  // Generic CRUD operations
  public create<T extends StorageItem>(collection: string, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const collections = this.getCollection<T>(collection);
    
    const newItem = {
      ...item,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;
    
    collections.push(newItem);
    this.saveCollection(collection, collections);
    
    return newItem;
  }

  public getAll<T>(collection: string): T[] {
    return this.getCollection<T>(collection);
  }

  public getById<T extends StorageItem>(collection: string, id: string): T | null {
    const collections = this.getCollection<T>(collection);
    const item = collections.find(item => item.id === id);
    return item || null;
  }

  public update<T extends StorageItem>(collection: string, id: string, updates: Partial<T>): T | null {
    const collections = this.getCollection<T>(collection);
    const index = collections.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = {
      ...collections[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    collections[index] = updatedItem;
    this.saveCollection(collection, collections);
    
    return updatedItem;
  }

  public delete<T extends StorageItem>(collection: string, id: string): boolean {
    const collections = this.getCollection<T>(collection);
    const index = collections.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    collections.splice(index, 1);
    this.saveCollection(collection, collections);
    
    return true;
  }

  public query<T>(collection: string, filter: (item: T) => boolean): T[] {
    const collections = this.getCollection<T>(collection);
    return collections.filter(filter);
  }

  // Specific methods for each collection
  public createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Agent {
    return this.create<Agent>(COLLECTIONS.AGENTS, agent);
  }

  public getAllAgents(): Agent[] {
    return this.getAll<Agent>(COLLECTIONS.AGENTS);
  }

  public getAgentById(id: string): Agent | null {
    return this.getById<Agent>(COLLECTIONS.AGENTS, id);
  }

  public updateAgent(id: string, updates: Partial<Agent>): Agent | null {
    return this.update<Agent>(COLLECTIONS.AGENTS, id, updates);
  }

  public deleteAgent(id: string): boolean {
    return this.delete<Agent>(COLLECTIONS.AGENTS, id);
  }

  // Prompt methods
  public createPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Prompt {
    return this.create<Prompt>(COLLECTIONS.PROMPTS, prompt);
  }

  public getAllPrompts(): Prompt[] {
    return this.getAll<Prompt>(COLLECTIONS.PROMPTS);
  }

  public getPromptById(id: string): Prompt | null {
    return this.getById<Prompt>(COLLECTIONS.PROMPTS, id);
  }

  public updatePrompt(id: string, updates: Partial<Prompt>): Prompt | null {
    return this.update<Prompt>(COLLECTIONS.PROMPTS, id, updates);
  }

  public deletePrompt(id: string): boolean {
    return this.delete<Prompt>(COLLECTIONS.PROMPTS, id);
  }

  // Initialize demo data if collections are empty
  public initDemoData(): void {
    // Skip initialization during server-side rendering
    if (!this.isBrowser()) {
      return;
    }
    
    // Only initialize if collections are empty
    if (this.getAllAgents().length === 0) {
      // Create demo agents
      this.createAgent({
        name: 'Customer Support Agent',
        description: 'Handles customer inquiries and support tickets',
        type: 'single',
        status: 'active',
        model: 'gpt-4',
        maxTokens: 2048,
        temperature: 0.7,
        promptTemplate: 'You are a helpful customer support agent for Alpha Platform. {{input}}',
        enableMemory: false,
        enableTools: false,
        tools: []
      });

      this.createAgent({
        name: 'Data Analyst Agent',
        description: 'Processes and analyzes data sets',
        type: 'single',
        status: 'inactive',
        model: 'gpt-3.5-turbo',
        maxTokens: 4096,
        temperature: 0.2,
        promptTemplate: 'You are a data analyst assistant. {{input}}',
        enableMemory: true,
        enableTools: true,
        memoryType: 'hybrid',
        embeddingModel: 'text-embedding-ada-002',
        memoryRetention: 'permanent',
        tools: ['calculator', 'api_connector'],
      });

      this.createAgent({
        name: 'Research Assistant',
        description: 'Helps with research tasks and information gathering',
        type: 'network',
        status: 'active',
        model: 'claude-2',
        maxTokens: 8192,
        temperature: 0.5,
        promptTemplate: 'You are a research assistant. {{input}}',
        enableMemory: true,
        enableTools: true,
        memoryType: 'vector',
        embeddingModel: 'e5-large',
        memoryRetention: 'permanent',
        tools: ['web_search', 'url_fetcher', 'api_connector'],
      });
    }

    // Create demo prompts if none exist
    if (this.getAllPrompts().length === 0) {
      this.createPrompt({
        name: 'Customer Inquiry Template',
        description: 'Template for handling customer inquiries',
        templateType: 'chat',
        content: 'You are a customer support agent for Alpha Platform. Your goal is to help the customer with their inquiry in a friendly and helpful manner.\n\nCustomer inquiry: {{input}}\n\nYour response should be professional, accurate, and address all parts of the customer\'s question.',
        tags: ['customer-support', 'inquiry'],
        parameters: [{ name: 'input', type: 'string', description: 'Customer inquiry' }],
        lastEditedBy: 'user-123',
        version: 1,
      });

      this.createPrompt({
        name: 'Data Analysis Report',
        description: 'Template for generating data analysis reports',
        templateType: 'completion',
        content: 'Analyze the following data and provide a comprehensive report:\n\nData: {{data}}\n\nYour analysis should include:\n1. Key trends and patterns\n2. Anomalies or outliers\n3. Actionable insights\n4. Recommendations for further analysis',
        tags: ['data-analysis', 'report'],
        parameters: [{ name: 'data', type: 'string', description: 'Raw data to analyze' }],
        lastEditedBy: 'user-123',
        version: 1,
      });

      this.createPrompt({
        name: 'Research Query Template',
        description: 'Template for handling research queries',
        templateType: 'chat',
        content: 'You are a research assistant. Your goal is to provide accurate, well-sourced information on the following topic:\n\nResearch topic: {{topic}}\n\nAdditional context: {{context}}\n\nProvide a comprehensive answer with citations where applicable.',
        tags: ['research', 'academic'],
        parameters: [
          { name: 'topic', type: 'string', description: 'Research topic' },
          { name: 'context', type: 'string', description: 'Additional context or requirements', optional: true }
        ],
        lastEditedBy: 'user-123',
        version: 1,
      });
    }
  }
}

// Create and export singleton instance
export const storageService = new StorageService();

// Initialize demo data when imported
storageService.initDemoData();

export default storageService;
