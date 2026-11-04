export const services: string[] = [
  "Bridal Mehandi",
  "Arabic Mehandi",
  "Traditional Mehandi",
  "Engagement Mehandi",
];

export function calculatePrice(basePrice: number, quantity: number): number {
  return basePrice * quantity;
}
