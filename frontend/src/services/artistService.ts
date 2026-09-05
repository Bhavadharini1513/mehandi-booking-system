import axiosInstance from "../utils/axiosInstance";

import { ArtistApplication, ArtistProfile } from "../types/Artist";

// Customer -> Become Artist

export const becomeArtist = async (artistData: ArtistApplication) => {
  const response = await axiosInstance.post(
    "/artist/become-artist",
    artistData,
  );

  return response.data;
};

// Customer -> My Application

export const getMyApplication = async () => {
  const response = await axiosInstance.get("/artist/my-application");

  return response.data;
};

// Artist -> Profile

export const getArtistProfile = async (): Promise<{
  success: boolean;
  profile: ArtistProfile;
}> => {
  const response = await axiosInstance.get("/artist/profile");

  return response.data;
};

// Public -> Approved Artists

export const getApprovedArtists = async () => {
  const response = await axiosInstance.get("/artist/approved");

  return response.data;
};

// Admin -> Applications

export const getArtistApplications = async () => {
  const response = await axiosInstance.get("/artist/applications");

  return response.data;
};

// Admin -> Approve

export const approveArtist = async (id: string) => {
  const response = await axiosInstance.put(
    `/artist/applications/${id}/approve`,
  );

  return response.data;
};

// Admin -> Reject

export const rejectArtist = async (id: string) => {
  const response = await axiosInstance.put(`/artist/applications/${id}/reject`);

  return response.data;
};
