export enum BookingStatus {
  PENDING = "Pending",
  CONFIRMED = "Confirmed",
  COMPLETED = "Completed",
}

export function createBooking(customerName: string, service: string): string {
  return `Booking created for ${customerName} - ${service}`;
}
