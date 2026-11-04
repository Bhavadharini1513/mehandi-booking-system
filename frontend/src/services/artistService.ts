import axiosInstance from "../utils/axiosInstance";
import { ArtistApplication, ArtistProfile } from "../types/Artist";

export interface PublicArtist {
  _id: string;
  userId: string;

  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  role: string;

  experience: number;
  specialization: string;
  location: string;

  availableLocations: string[];
  availableTime: string;

  services: string[];
  bio: string;

  profileImage?: string;

  pricePerHour: number;

  rating: number;
  totalReviews: number;

  status: string;
  createdAt: string;
}

export interface ServiceItem {
  name: string;
  artistCount: number;
}

export const becomeArtist = async (artistData: ArtistApplication) => {
  const response = await axiosInstance.post(
    "/artist/become-artist",
    artistData,
  );

  return response.data;
};

/* Public profile of ONE approved artist */
export const getArtistById = async (
  id: string,
): Promise<{ success: boolean; artist: PublicArtist }> => {
  const response = await axiosInstance.get(`/artist/${id}`);

  return response.data;
};

export const getMyApplication = async () => {
  const response = await axiosInstance.get("/artist/my-application");

  return response.data;
};

export const getArtistProfile = async (): Promise<{
  success: boolean;
  profile: ArtistProfile;
}> => {
  const response = await axiosInstance.get("/artist/profile");

  return response.data;
};

/* IMPORTANT: Services.tsx uses this function */
export const getServices = async (): Promise<{
  success: boolean;
  count: number;
  services: ServiceItem[];
}> => {
  const response = await axiosInstance.get("/artist/services");

  return response.data;
};

export const getApprovedArtists = async (
  service: string = "",
  location: string = "",
): Promise<{
  success: boolean;
  count: number;
  artists: PublicArtist[];
}> => {
  const params = new URLSearchParams();

  if (service.trim()) {
    params.set("service", service.trim());
  }

  if (location.trim()) {
    params.set("location", location.trim());
  }

  const query = params.toString();

  const response = await axiosInstance.get(
    `/artist/approved${query ? `?${query}` : ""}`,
  );

  return response.data;
};
