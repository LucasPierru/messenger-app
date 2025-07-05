import { create } from "zustand";
import { Socket } from "socket.io-client";
import { login, signup, logout, checkAuth } from "@/api/auth/auth";
import { getSocket } from "@/socket";
import { AuthResponse, AuthUser, LoginCredentials, SignupCredentials } from "@/types/auth";
import { ProfileFormData } from "@/lib/inputValidation/profileValidation";
import { updateProfile } from "@/api/profile/profile";
import { IUser } from "@/types/user";

type AuthState = {
  authUser: AuthUser | null; // Replace 'any' with your user type
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (data: SignupCredentials) => Promise<AuthResponse | null>; // Replace 'any' with your signup data type
  login: (data: LoginCredentials) => Promise<AuthResponse | null>; // Replace 'any' with your login data type
  logout: () => Promise<void>;
  updateProfile: (data: ProfileFormData) => Promise<{ profile: IUser | null, error: unknown | null }>; // Replace 'any' with your profile update data type
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await checkAuth();
      set({ authUser: res.data?.user ?? null });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await signup(data);
      set({ authUser: res.data?.user });
      get().connectSocket();
      return res.data
    } catch (error) {
      console.log("Error in signup:", error);
      set({ authUser: null });
      return null
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await login(data)
      set({ authUser: res.data?.user });
      get().connectSocket();
      return res.data
    } catch (error) {
      console.log("Error in login:", error);
      set({ authUser: null });
      return null
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await logout()
      set({ authUser: null });
      get().disconnectSocket();
    } catch (error) {
      console.log("Error in logout:", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const { profile, error } = await updateProfile(data);
      // toast.success("Profile updated successfully");
      return { profile, error }
    } catch (error) {
      console.log("error in update profile:", error);
      // toast.error(error.response.data.message);
      return { profile: null, error }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const token = localStorage.getItem("token");

    if (!token || get().socket?.connected) return;

    const socket = getSocket(token || "");

    socket.connect();

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket && get().socket?.connected) get().socket?.disconnect();
  },
}));