import { PhoneNumber } from './phone-number.value-object';

describe('PhoneNumber', () => {
  it('should create a valid phone number', () => {
    const phoneNumber = PhoneNumber.create('3001234567');

    expect(phoneNumber.getValue()).toBe('3001234567');
  });

  it('should reject numbers that do not have 10 digits', () => {
    expect(() => PhoneNumber.create('300123456')).toThrow(
      'Invalid phone number: must be 10 digits starting with 3',
    );
  });

  it('should reject numbers that do not start with 3', () => {
    expect(() => PhoneNumber.create('2001234567')).toThrow(
      'Invalid phone number: must be 10 digits starting with 3',
    );
  });

  it('should compare value equality correctly', () => {
    const phoneA = PhoneNumber.create('3001234567');
    const phoneB = PhoneNumber.create('3001234567');
    const phoneC = PhoneNumber.create('3011234567');

    expect(phoneA.equals(phoneB)).toBe(true);
    expect(phoneA.equals(phoneC)).toBe(false);
  });
});
