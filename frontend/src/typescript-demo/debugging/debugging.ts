// ======================================================
// TYPESCRIPT DEBUGGING EXAMPLE
// ======================================================

interface Booking {
  customerName: string;

  service: string;

  price: number;
}

export function calculateBookingTotal(booking: Booking): number {
  // Debugging breakpoint can be placed here

  console.log("Booking details:", booking);

  const total = booking.price;

  console.log("Calculated total:", total);

  return total;
}

export function debugBooking(): void {
  const booking: Booking = {
    customerName: "Bhavadharini",

    service: "Bridal Mehandi",

    price: 2500,
  };

  const total = calculateBookingTotal(booking);

  console.log(`Final booking amount: ₹${total}`);
}
