import axiosInstance from "../utils/axiosInstance";

export interface PaymentConfig {
  success: boolean;
  mode: "live" | "demo";
  keyId: string;
}

export interface PaymentOrder {
  success: boolean;
  mode: "live" | "demo";
  keyId: string;
  orderId: string;
  amount: number; // paise
  currency: string;
  booking: {
    _id: string;
    service: string;
    artist: string;
    customer: string;
    email: string;
  };
}

export interface VerifyPayload {
  bookingId: string;
  orderId: string;
  paymentId: string;
  signature: string;
}

export const getPaymentConfig = async (): Promise<PaymentConfig> => {
  const response = await axiosInstance.get("/payments/config");

  return response.data;
};

export const createPaymentOrder = async (
  bookingId: string,
): Promise<PaymentOrder> => {
  const response = await axiosInstance.post("/payments/create-order", {
    bookingId,
  });

  return response.data;
};

export const verifyPayment = async (payload: VerifyPayload) => {
  const response = await axiosInstance.post("/payments/verify", payload);

  return response.data;
};
