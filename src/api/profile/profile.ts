import { IUser } from "@/types/user";
import api from "../api";

export const fetchProfile = async (): Promise<{
  profile: IUser | null;
  error: unknown | null;
}> => {
  try {
    const response = await api.get("/v1/profile");
    return { ...response.data, error: null };
  } catch (error) {
    return { profile: null, error };
  }
};

export const fetchProfiles = async (search: string): Promise<{
  profiles: IUser[] | null;
  error: unknown | null;
}> => {
  try {
    const response = await api.get(`/v1/profile/search?search=${encodeURIComponent(search)}`);
    return { ...response.data, error: null };
  } catch (error) {
    return { profiles: null, error };
  }
};

