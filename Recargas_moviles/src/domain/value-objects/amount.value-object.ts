/**
 * Value Object for Amount.
 * Encapsulates amount validation and behavior.
 * Enforces business rules: minimum 1000, maximum 100000.
 */
export class Amount {
  private readonly value: number;

  private readonly MIN_AMOUNT = 1000;
  private readonly MAX_AMOUNT = 100000;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * Factory method with validation.
   */
  static create(amount: number): Amount {
    if (!this.isValid(amount)) {
      throw new Error(
        `Invalid amount: must be between ${1000} and ${100000}`,
      );
    }
    return new Amount(amount);
  }

  private static isValid(amount: number): boolean {
    return amount >= 1000 && amount <= 100000;
  }

  getValue(): number {
    return this.value;
  }

  equals(other: Amount): boolean {
    return this.value === other.value;
  }
}
