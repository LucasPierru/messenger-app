import { create } from "zustand";
import { Socket, io } from "socket.io-client";
import { IUser } from "@/types/user";
import { login, signup, logout } from "@/api/auth/auth";
import { getSocket } from "@/socket";

type AuthState = {
  authUser: IUser | null; // Replace 'any' with your user type
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  signup: (data: any) => Promise<void>; // Replace 'any' with your signup data type
  login: (data: any) => Promise<void>; // Replace 'any' with your login data type
  logout: () => Promise<void>;
  /* updateProfile: (data: any) => Promise<void>; // Replace 'any' with your profile update data type */
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

  /* checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  }, */

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await signup(data);
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in signup:", error);
      set({ authUser: null });
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await login(data)
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in login:", error);
      set({ authUser: null });
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

  /* updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  }, */

  connectSocket: () => {
    /* const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
 */
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