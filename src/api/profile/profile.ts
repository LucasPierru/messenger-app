import { IUser } from "@/types/user";
import api from "../api";
import { ProfileFormData } from "@/lib/inputValidation/profileValidation";

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

export const updateProfile = async (data: ProfileFormData): Promise<{
  profile: IUser | null;
  error: unknown | null;
}> => {
  try {
    const response = await api.post("/v1/profile/update", data);
    return { ...response.data, error: null };
  } catch (error) {
    return { profile: null, error };
  }
};
