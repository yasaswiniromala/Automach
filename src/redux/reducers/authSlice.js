import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userDetails: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { userDetails, keepMeSignedIn } = action.payload;
      state.isLoggedIn = true;
      state.userDetails = userDetails;
      
      if (keepMeSignedIn) {
        localStorage.setItem('userDetails', JSON.stringify(userDetails));
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userDetails = null;
      
      localStorage.removeItem('userDetails');
    },
    loadAuth: (state) => {
      // Logic to load authentication status from local storage if needed
      const storedUser = localStorage.getItem('userDetails');
      if (storedUser) {
        state.isLoggedIn = true;
        state.userDetails = JSON.parse(storedUser);
      }
    }
  }
});

export const { loginSuccess, logout, loadAuth } = authSlice.actions;

export default authSlice.reducer;
