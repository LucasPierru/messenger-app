import api from "../api";

type LoginCredentials = {
  email: string;
  password: string;
};

type SignupCredentials = {
  firstName: string;
  lastName: string;
} & LoginCredentials;

export const login = async ({ email, password }: LoginCredentials) => {
  try {
    const response = await api.post("/v1/auth/login", { email, password });
    localStorage.setItem("token", response.data.token); // Save the token
    return { data: response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const signup = async ({ email, firstName, lastName, password }: SignupCredentials) => {
  try {
    const response = await api.post("/v1/auth/register", { email, firstName, lastName, password });
    localStorage.setItem("token", response.data.token); // Save the token
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
