import { Amount } from './amount.value-object';

describe('Amount', () => {
  it('should create a valid amount', () => {
    const amount = Amount.create(5000);

    expect(amount.getValue()).toBe(5000);
  });

  it('should accept the minimum valid amount', () => {
    expect(Amount.create(1000).getValue()).toBe(1000);
  });

  it('should accept the maximum valid amount', () => {
    expect(Amount.create(100000).getValue()).toBe(100000);
  });

  it('should reject amounts below the minimum', () => {
    expect(() => Amount.create(999)).toThrow(
      'Invalid amount: must be between 1000 and 100000',
    );
  });

  it('should reject amounts above the maximum', () => {
    expect(() => Amount.create(100001)).toThrow(
      'Invalid amount: must be between 1000 and 100000',
    );
  });

  it('should compare value equality correctly', () => {
    const amountA = Amount.create(5000);
    const amountB = Amount.create(5000);
    const amountC = Amount.create(7000);

    expect(amountA.equals(amountB)).toBe(true);
    expect(amountA.equals(amountC)).toBe(false);
  });
});
