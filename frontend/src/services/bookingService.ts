import axiosInstance from "../utils/axiosInstance";

import { Availability, Booking, NewBooking } from "../types/Booking";

export type { Booking, NewBooking, Availability };

interface BookingResponse {
  success: boolean;
  message: string;
  booking: Booking;
}

/* Which hours of an artist are already taken on a date? (public) */
export const getAvailability = async (
  artistProfileId: string,
  date: string,
): Promise<Availability> => {
  const response = await axiosInstance.get(
    `/bookings/availability/${artistProfileId}`,
    { params: { date } },
  );

  return response.data;
};

export const createBooking = async (
  data: NewBooking,
): Promise<BookingResponse> => {
  const response = await axiosInstance.post("/bookings", data);

  return response.data;
};

export const getMyBookings = async (): Promise<{
  success: boolean;
  count: number;
  bookings: Booking[];
}> => {
  const response = await axiosInstance.get("/bookings/my");

  return response.data;
};

export const getBooking = async (
  id: string,
): Promise<{ success: boolean; booking: Booking }> => {
  const response = await axiosInstance.get(`/bookings/${id}`);

  return response.data;
};

/* ---------------- artist ---------------- */

export const acceptBooking = async (id: string): Promise<BookingResponse> => {
  const response = await axiosInstance.put(`/bookings/${id}/accept`);

  return response.data;
};

export const rejectBooking = async (
  id: string,
  reason: string,
  needMoreInfo: boolean,
): Promise<BookingResponse> => {
  const response = await axiosInstance.put(`/bookings/${id}/reject`, {
    reason,
    needMoreInfo,
  });

  return response.data;
};

export const completeBooking = async (id: string): Promise<BookingResponse> => {
  const response = await axiosInstance.put(`/bookings/${id}/complete`);

  return response.data;
};

/* ---------------- customer ---------------- */

export const resubmitBooking = async (
  id: string,
  notes: string,
): Promise<BookingResponse> => {
  const response = await axiosInstance.put(`/bookings/${id}/resubmit`, {
    notes,
  });

  return response.data;
};

/* ---------------- both ---------------- */

export const cancelBooking = async (
  id: string,
  reason = "",
): Promise<BookingResponse> => {
  const response = await axiosInstance.put(`/bookings/${id}/cancel`, {
    reason,
  });

  return response.data;
};
