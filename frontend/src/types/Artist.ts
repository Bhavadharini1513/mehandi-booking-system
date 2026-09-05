import { User } from "./User";

export enum ArtistStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface ArtistApplication {
  experience: number;
  specialization: string;
  bio: string;
  location: string;
  availableLocations: string[];
  availableTime: string;
  services: string[];
  profileImage?: string;
}

export interface ArtistProfile extends ArtistApplication {
  _id: string;
  user: User;
  status: ArtistStatus;
  rating: number;
  totalReviews: number;
}
