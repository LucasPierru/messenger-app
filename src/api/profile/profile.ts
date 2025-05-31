import api from "../api";

export const fetchProfile = async () => {
  try {
    const response = await api.get("/v1/profile");
    return { ...response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchProfiles = async (search: string) => {
  try {
    const response = await api.get(`/v1/profile/search?search=${encodeURIComponent(search)}`);
    return { ...response.data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

