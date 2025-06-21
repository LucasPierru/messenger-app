import { AxiosResponse } from "axios";
import api from "../api";

type LoginCredentials = {
  email: string;
  password: string;
};

type SignupCredentials = {
  firstName: string;
  lastName: string;
} & LoginCredentials;

type AuthResponse = {
  token: string;
  lastConversationId?: string;
};

export const login = async ({ email, password }: LoginCredentials): Promise<{ data: AuthResponse | null; error: unknown }> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post("/v1/auth/login", { email, password });
    localStorage.setItem("token", response.data.token); // Save the token
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signup = async ({ email, firstName, lastName, password }: SignupCredentials): Promise<{ data: AuthResponse | null; error: unknown }> => {
  try {
    const response = await api.post("/v1/auth/register", { email, firstName, lastName, password });
    localStorage.setItem("token", response.data.token); // Save the token
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const changePassword = async ({ email, password }: LoginCredentials) => {
  try {
    const response = await api.post("/v1/auth/change-password", { email, password });
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const logout = async () => {
  try {
    localStorage.removeItem("token"); // Save the token
    return { data: { success: true }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
