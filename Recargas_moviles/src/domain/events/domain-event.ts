/**
 * Base abstract class for all domain events.
 * Implements the Event Sourcing pattern foundation.
 */
export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
    this.occurredAt = new Date();
  }

  abstract getEventName(): string;
}
