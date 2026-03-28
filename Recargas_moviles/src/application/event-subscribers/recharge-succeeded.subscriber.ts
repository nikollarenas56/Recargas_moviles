import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBus } from '../../domain/services/event-bus';
import { RechargeSucceededEvent } from '../../domain/events/recharge-succeeded.event';

/**
 * Domain Event Subscriber for RechargeSucceeded events.
 * Handles side effects that occur when a recharge is successful.
 * Can be extended to send notifications, update analytics, etc.
 */
@Injectable()
export class RechargeSucceededSubscriber implements OnModuleInit {
  constructor(private readonly eventBus: EventBus) {}

  onModuleInit(): void {
    // Subscribe to RechargeSucceeded events
    this.eventBus.subscribe(
      'RechargeSucceeded',
      this.handleRechargeSucceeded.bind(this),
    );
  }

  private async handleRechargeSucceeded(event: RechargeSucceededEvent): Promise<void> {
    console.log(
      `[Event] Recharge succeeded: ${event.transactionId} - Phone: ${event.phoneNumber}, Amount: ${event.amount}`,
    );

    // TODO: Implement side effects here
    // - Send SMS notification to user
    // - Update analytics
    // - Send webhook to provider
    // - Emit to other microservices
  }
}
