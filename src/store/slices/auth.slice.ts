import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDetailDto } from '../../types/user.type';

export interface LoginPayLoad {
  username: string,
  password: string
}

export interface RegisterPayLoad {
  username: string,
  password: string,
  password_confirmation: string
}

export interface ActivePayload {
  active_token: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  isLoading?: boolean;
  currentUser?: UserDetailDto;
  messageRegister: string;
  messageLogin: string;
}

const initialState: AuthState = {
  isLoggedIn: false, isLoading: false, currentUser: undefined, messageRegister: '', messageLogin: '',
};

const authSlice = createSlice({
  name: 'auth', initialState, reducers: {
    registerRequest(state, action: PayloadAction<RegisterPayLoad>) {
      state.isLoading = true;
    }, registerRequestFinish(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.messageRegister = action.payload;
    }, login(state, action: PayloadAction<LoginPayLoad>) {
      state.isLoading = true;
    }, loginSuccess(state, action: PayloadAction<UserDetailDto>) {
      state.isLoggedIn = true;
      state.isLoading = false;
      state.currentUser = action.payload;
    }, loginFailed(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.messageLogin = action.payload;
    },

    logout(state) {
      state.isLoggedIn = false;
      state.currentUser = undefined;
      state.messageRegister = '';
      state.messageLogin = '';
    },
  },
});

// Actions
export const authActions = authSlice.actions;

// Selectors
export const selectIsLoggedIn = (state: any) => state.auth.isLoggedIn;
export const selectIsLoading = (state: any) => state.auth.isLoading;
export const selectMessageRegister = (state: any) => state.auth.messageRegister;
export const selectMessageLogin = (state: any) => state.auth.messageLogin;
export const selectCurrentUser = (state: any) => state.auth.currentUser;

// Reducer
const authReducer = authSlice.reducer;
export default authReducer;
