// ==========================================
// ENUMS  (TypeScript Unit II - enum)
// ==========================================

export enum BookingStatus {
  PENDING = "pending",
  INFO_NEEDED = "info_needed",
  ACCEPTED = "accepted",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  UNPAID = "unpaid",
  PAID = "paid",
  REFUND_PENDING = "refund_pending",
}

// ==========================================
// INTERFACES
// ==========================================

export interface PersonSummary {
  _id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface Booking {
  _id: string;

  customer: PersonSummary;
  artist: PersonSummary;

  artistProfile?: {
    _id: string;
    location: string;
    specialization: string;
    services: string[];
    pricePerHour: number;
    profileImage?: string;
  };

  bookingDate: string;
  dateKey: string; // "YYYY-MM-DD"
  startTime: string; // "HH:00"
  endTime: string; // "HH:00"
  hours: number;

  service: string;
  venue: string;
  notes: string;

  amount: number;

  status: BookingStatus;
  statusReason: string;

  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentDueAt?: string;
  paidAt?: string;

  createdAt: string;
}

export interface NewBooking {
  artistProfileId: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  venue?: string;
  notes?: string;
}

export interface Availability {
  success: boolean;
  date: string;
  openHour: number;
  closeHour: number;
  pricePerHour: number;
  bookedHours: number[];
  pastHours: number[];
  blockedHours: number[];
}

export interface ChatMessage {
  _id: string;
  booking: string;
  sender: string;
  text: string;
  type: "user" | "system";
  createdAt: string;
}

// Tuple: [label, tailwind classes] used to colour a status badge
export type BadgeStyle = [label: string, classes: string];
