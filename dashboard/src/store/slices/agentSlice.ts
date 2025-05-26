import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Agent {
  id: string;
  name: string;
  description: string;
  promptId: string;
  model: {
    id: string;
    name: string;
    provider: string;
  };
  memoryEnabled: boolean;
  toolsEnabled: boolean[];
  createdAt: string;
  updatedAt: string;
}

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  loading: boolean;
  error: string | null;
}

const initialState: AgentState = {
  agents: [],
  selectedAgent: null,
  loading: false,
  error: null,
};

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    fetchAgentsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAgentsSuccess: (state, action: PayloadAction<Agent[]>) => {
      state.agents = action.payload;
      state.loading = false;
    },
    fetchAgentsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectAgent: (state, action: PayloadAction<string>) => {
      state.selectedAgent = state.agents.find(agent => agent.id === action.payload) || null;
    },
    clearSelectedAgent: (state) => {
      state.selectedAgent = null;
    },
    createAgentSuccess: (state, action: PayloadAction<Agent>) => {
      state.agents.push(action.payload);
    },
    updateAgentSuccess: (state, action: PayloadAction<Agent>) => {
      const index = state.agents.findIndex(agent => agent.id === action.payload.id);
      if (index !== -1) {
        state.agents[index] = action.payload;
        if (state.selectedAgent && state.selectedAgent.id === action.payload.id) {
          state.selectedAgent = action.payload;
        }
      }
    },
    deleteAgentSuccess: (state, action: PayloadAction<string>) => {
      state.agents = state.agents.filter(agent => agent.id !== action.payload);
      if (state.selectedAgent && state.selectedAgent.id === action.payload) {
        state.selectedAgent = null;
      }
    },
  },
});

export const {
  fetchAgentsRequest,
  fetchAgentsSuccess,
  fetchAgentsFailure,
  selectAgent,
  clearSelectedAgent,
  createAgentSuccess,
  updateAgentSuccess,
  deleteAgentSuccess,
} = agentSlice.actions;

export default agentSlice.reducer;
