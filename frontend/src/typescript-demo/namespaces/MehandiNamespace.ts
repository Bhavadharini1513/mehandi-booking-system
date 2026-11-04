// ======================================================
// TYPESCRIPT NAMESPACE
// ======================================================

export namespace MehandiSystem {
  export const applicationName = "Mehandi Booking System";

  export namespace Artist {
    export function getArtistMessage(name: string): string {
      return `${name} is a Mehandi artist.`;
    }
  }

  export namespace Booking {
    export function createBookingMessage(
      customer: string,
      service: string,
    ): string {
      return `${customer} booked ${service}.`;
    }
  }
}
