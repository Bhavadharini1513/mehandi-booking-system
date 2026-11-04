// ======================================================
// TYPESCRIPT MODULE
// ======================================================

export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function calculateBookingAmount(
  servicePrice: number,
  numberOfPeople: number,
): number {
  return servicePrice * numberOfPeople;
}
