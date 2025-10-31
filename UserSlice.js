// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userId: null,
  role: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.token = action.payload.token;
      // Also store in localStorage (optional, but needed for persistence)
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userId = null;
      state.role = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('editId');
    },
    loadUserFromStorage: (state) => {
      const user = localStorage.getItem('user');
      if (user) {
        const { userId, role, token } = JSON.parse(user);
        state.isLoggedIn = true;
        state.userId = userId;
        state.role = role;
        state.token = token;
      }
    }
  },
});

export const { login, logout, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;
