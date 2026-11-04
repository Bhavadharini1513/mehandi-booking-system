import { MehandiArtist } from "./classes";

export class PremiumArtist extends MehandiArtist {
  premiumCharge: number;

  constructor(name: string, experience: number, specialization: string) {
    super(name, experience, specialization);

    this.premiumCharge = 500;
  }

  getPremiumDetails(): string {
    return `${this.name} is a Premium Mehandi Artist with an additional ₹${this.premiumCharge} premium charge.`;
  }

  calculateServicePrice(basePrice: number): number {
    return super.calculateServicePrice(basePrice) + this.premiumCharge;
  }
}
