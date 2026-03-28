/**
 * Value Object for Phone Number.
 * Encapsulates phone number validation and behavior.
 * Value Objects are immutable and have no identity.
 */
export class PhoneNumber {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Factory method with validation.
   */
  static create(phoneNumber: string): PhoneNumber {
    if (!this.isValid(phoneNumber)) {
      throw new Error(
        'Invalid phone number: must be 10 digits starting with 3',
      );
    }
    return new PhoneNumber(phoneNumber);
  }

  private static isValid(phoneNumber: string): boolean {
    const phoneRegex = /^3\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PhoneNumber): boolean {
    return this.value === other.value;
  }
}
