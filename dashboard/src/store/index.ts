import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Import reducers
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import agentReducer from './slices/agentSlice';
import promptReducer from './slices/promptSlice';

// Root reducer
const rootReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  agents: agentReducer,
  prompts: promptReducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
