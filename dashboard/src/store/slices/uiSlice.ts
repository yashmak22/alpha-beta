import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidenavOpen: boolean;
  colorMode: 'light' | 'dark';
  activePanel: string;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  createdAt: number;
  read: boolean;
}

const initialState: UIState = {
  sidenavOpen: true,
  colorMode: 'light',
  activePanel: 'dashboard',
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidenav: (state) => {
      state.sidenavOpen = !state.sidenavOpen;
    },
    setSidenavOpen: (state, action: PayloadAction<boolean>) => {
      state.sidenavOpen = action.payload;
    },
    toggleColorMode: (state) => {
      state.colorMode = state.colorMode === 'light' ? 'dark' : 'light';
    },
    setColorMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.colorMode = action.payload;
    },
    setActivePanel: (state, action: PayloadAction<string>) => {
      state.activePanel = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'read'>>) => {
      const id = Date.now().toString();
      state.notifications.unshift({
        ...action.payload,
        id,
        createdAt: Date.now(),
        read: false,
      });
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleSidenav,
  setSidenavOpen,
  toggleColorMode,
  setColorMode,
  setActivePanel,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
