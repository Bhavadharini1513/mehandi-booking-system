//class

export class MehandiArtist {
  // Properties

  public name: string;

  public experience: number;

  public specialization: string;

  // Constructor

  constructor(name: string, experience: number, specialization: string) {
    this.name = name;
    this.experience = experience;
    this.specialization = specialization;
  }

  // Method

  public getDetails(): string {
    return `${this.name} is a ${this.specialization} artist with ${this.experience} years of experience.`;
  }

  // Method

  public calculateServicePrice(basePrice: number): number {
    return basePrice + this.experience * 100;
  }
}

// Create object

export const sampleArtist = new MehandiArtist("Priya", 5, "Bridal Mehandi");

// Example

console.log(sampleArtist.getDetails());

console.log(sampleArtist.calculateServicePrice(1500));
