import { DomainEvent } from './domain-event';

/**
 * Domain event emitted when a recharge transaction is successfully created.
 * This event represents a fact that occurred in the business domain.
 */
export class RechargeSucceededEvent extends DomainEvent {
  constructor(
    public readonly transactionId: string,
    public readonly phoneNumber: string,
    public readonly amount: number,
    public readonly userId: number,
  ) {
    super(transactionId);
  }

  getEventName(): string {
    return 'RechargeSucceeded';
  }
}
