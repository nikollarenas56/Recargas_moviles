import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../events/domain-event';

/**
 * In-memory Event Bus implementation.
 * Implements the Observer pattern to handle domain events.
 */
@Injectable()
export class EventBus {
  private subscribers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map();

  /**
   * Subscribe to domain events of a specific type.
   */
  subscribe(
    eventName: string,
    handler: (event: DomainEvent) => Promise<void>,
  ): void {
    if (!this.subscribers.has(eventName)) {
      this.subscribers.set(eventName, []);
    }
    this.subscribers.get(eventName)!.push(handler);
  }

  /**
   * Publish a domain event to all subscribers.
   */
  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.getEventName();
    const handlers = this.subscribers.get(eventName) || [];

    // Execute all handlers in parallel
    await Promise.all(
      handlers.map(handler => 
        handler(event).catch(error => 
          console.error(`Error handling event ${eventName}:`, error)
        )
      )
    );
  }

  /**
   * Clear all subscribers (useful for testing).
   */
  clearSubscribers(): void {
    this.subscribers.clear();
  }
}
