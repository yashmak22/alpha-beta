import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  version: number;
  versionHistory: {
    version: number;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface PromptState {
  prompts: Prompt[];
  selectedPrompt: Prompt | null;
  draftPrompt: Partial<Prompt> | null;
  loading: boolean;
  error: string | null;
}

const initialState: PromptState = {
  prompts: [],
  selectedPrompt: null,
  draftPrompt: null,
  loading: false,
  error: null,
};

const promptSlice = createSlice({
  name: 'prompts',
  initialState,
  reducers: {
    fetchPromptsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPromptsSuccess: (state, action: PayloadAction<Prompt[]>) => {
      state.prompts = action.payload;
      state.loading = false;
    },
    fetchPromptsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectPrompt: (state, action: PayloadAction<string>) => {
      state.selectedPrompt = state.prompts.find(prompt => prompt.id === action.payload) || null;
    },
    clearSelectedPrompt: (state) => {
      state.selectedPrompt = null;
    },
    createDraftPrompt: (state) => {
      state.draftPrompt = {
        name: '',
        description: '',
        content: '',
        tags: [],
      };
    },
    updateDraftPrompt: (state, action: PayloadAction<Partial<Prompt>>) => {
      if (state.draftPrompt) {
        state.draftPrompt = { ...state.draftPrompt, ...action.payload };
      }
    },
    clearDraftPrompt: (state) => {
      state.draftPrompt = null;
    },
    createPromptSuccess: (state, action: PayloadAction<Prompt>) => {
      state.prompts.push(action.payload);
      state.draftPrompt = null;
    },
    updatePromptSuccess: (state, action: PayloadAction<Prompt>) => {
      const index = state.prompts.findIndex(prompt => prompt.id === action.payload.id);
      if (index !== -1) {
        state.prompts[index] = action.payload;
        if (state.selectedPrompt && state.selectedPrompt.id === action.payload.id) {
          state.selectedPrompt = action.payload;
        }
      }
      state.draftPrompt = null;
    },
    deletePromptSuccess: (state, action: PayloadAction<string>) => {
      state.prompts = state.prompts.filter(prompt => prompt.id !== action.payload);
      if (state.selectedPrompt && state.selectedPrompt.id === action.payload) {
        state.selectedPrompt = null;
      }
    },
  },
});

export const {
  fetchPromptsRequest,
  fetchPromptsSuccess,
  fetchPromptsFailure,
  selectPrompt,
  clearSelectedPrompt,
  createDraftPrompt,
  updateDraftPrompt,
  clearDraftPrompt,
  createPromptSuccess,
  updatePromptSuccess,
  deletePromptSuccess,
} = promptSlice.actions;

export default promptSlice.reducer;
