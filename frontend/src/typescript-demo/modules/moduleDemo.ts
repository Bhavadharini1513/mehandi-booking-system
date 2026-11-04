import { add, subtract, multiply, calculateBookingAmount } from "./calculator";

export function runModuleDemo(): string[] {
  return [
    `Addition: ${add(10, 20)}`,

    `Subtraction: ${subtract(30, 10)}`,

    `Multiplication: ${multiply(5, 4)}`,

    `Booking Amount: ${calculateBookingAmount(1500, 3)}`,
  ];
}
