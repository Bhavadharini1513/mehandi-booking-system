export class MehandiArtist {
  constructor(
    public name: string,
    public experience: number,
    public specialization: string,
  ) {}

  getDetails(): string {
    return `${this.name} - ${this.experience} years experience - ${this.specialization}`;
  }
}
