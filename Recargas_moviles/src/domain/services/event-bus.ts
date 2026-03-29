import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../events/domain-event';

/**
 * Event Bus en memoria.
 * Implementa patrón Observer para propagar eventos de dominio.
 *
 * Nota: en producción puede sustituirse por un broker (RabbitMQ/Kafka)
 * manteniendo el mismo contrato de publicación/suscripción.
 */
@Injectable()
export class EventBus {
  private subscribers: Map<string, Array<(event: DomainEvent) => Promise<void>>> = new Map();

  /**
    * Registra un handler para un tipo de evento.
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
    * Publica un evento de dominio a todos los suscriptores.
   */
  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.getEventName();
    const handlers = this.subscribers.get(eventName) || [];

    // Ejecuta handlers en paralelo para no bloquear el flujo principal.
    await Promise.all(
      handlers.map(handler => 
        handler(event).catch(error => 
          console.error(`Error handling event ${eventName}:`, error)
        )
      )
    );
  }

  /**
   * Limpia suscriptores (útil en pruebas).
   */
  clearSubscribers(): void {
    this.subscribers.clear();
  }
}
