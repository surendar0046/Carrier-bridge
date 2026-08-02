import { useAuthStore } from '../slices/authSlice';

export const selectIsAuthenticated = (state: ReturnType<typeof useAuthStore.getState>) => state.isAuthenticated;
export const selectAuthToken = (state: ReturnType<typeof useAuthStore.getState>) => state.token;
export const selectAuthLoading = (state: ReturnType<typeof useAuthStore.getState>) => state.isLoading;
export const selectAuthError = (state: ReturnType<typeof useAuthStore.getState>) => state.error;
