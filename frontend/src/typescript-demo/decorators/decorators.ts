// ======================================================
// TYPESCRIPT DECORATORS
// ======================================================

function LogClass(value: Function) {
  console.log(`Class created: ${value.name}`);
}

// Class decorator

@LogClass
export class BookingService {
  createBooking(customer: string, service: string): string {
    return `${customer} booked ${service}`;
  }
}
