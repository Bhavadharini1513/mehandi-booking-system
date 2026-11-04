export const isAvailable: boolean = true;

export const isBookingConfirmed: boolean = false;


export const artistName: string = "Mehandi Artist";


export const experience: number = 5;


export const services: string[] = [
  "Bridal Mehandi",
  "Arabic Mehandi",
  "Traditional Mehandi",
  "Party Mehandi",
];


export const prices: Array<number> = [1000, 1500, 2000, 2500];



export const artistDetails: [string, number, boolean] = ["Priya", 5, true];



export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}



export function calculatePrice(price: number, quantity: number): number {
  return price * quantity;
}



export const greetArtist = (name: string): string => {
  return `Welcome ${name}`;
};



export function createBooking(
  customerName: string,
  service: string,
  date?: string,
): string {
  if (date) {
    return `${customerName} booked ${service} on ${date}`;
  }

  return `${customerName} booked ${service}`;
}



export const artist = {
  name: "Priya",
  experience: 5,
  available: true,
};



export function checkAvailability(available: boolean): string {
  if (available) {
    return "Artist is available";
  }

  return "Artist is not available";
}



export function displayServices(): string[] {
  const result: string[] = [];

  for (const service of services) {
    result.push(service);
  }

  return result;
}
