# Arquitectura DDD + Event-Driven Design

Este documento describe la arquitectura Domain-Driven Design (DDD) implementada en el proyecto PuntoRed Backend.

## Estructura de Carpetas

```
src/
├── domain/                          # Lógica de negocio pura
│   ├── events/                      # Eventos de dominio
│   │   ├── domain-event.ts         # Clase base para eventos
│   │   └── recharge-succeeded.event.ts  # Evento de recarga exitosa
│   ├── services/
│   │   └── event-bus.ts            # Bus de eventos en memoria
│   └── value-objects/              # Objetos de valor
│       ├── phone-number.value-object.ts
│       └── amount.value-object.ts
│
├── application/                     # Capa de aplicación
│   ├── application.module.ts        # Módulo de aplicación
│   ├── use-cases/                   # Casos de uso
│   │   └── create-recharge.use-case.ts
│   ├── dto/                         # Data Transfer Objects
│   │   └── create-recharge.dto.ts
│   └── event-subscribers/           # Manejadores de eventos
│       └── recharge-succeeded.subscriber.ts
│
├── infrastructure/                  # Capa de infraestructura (implícita)
│   └── ... (Controllers, Entities de TypeORM)
│
└── ... (auth/, common/, config/, users/)
```

## Patrones Implementados

### 1. Domain Events (Eventos de Dominio)

Los eventos de dominio representan hechos que han ocurrido en el negocio:

```typescript
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
```

### 2. Event Bus (Bus de Eventos)

Implementación en memoria del patrón Observer para publicar y suscribirse a eventos:

```typescript
@Injectable()
export class EventBus {
  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.getEventName();
    const handlers = this.subscribers.get(eventName) || [];
    
    await Promise.all(
      handlers.map(handler => 
        handler(event).catch(error => 
          console.error(`Error handling event ${eventName}:`, error)
        )
      )
    );
  }
}
```

### 3. Value Objects (Objetos de Valor)

Encapsulan y validan conceptos del dominio:

**PhoneNumber:**
- 10 dígitos
- Comienza con 3
- Validación en tiempo de creación

**Amount:**
- Rango: 1000 - 100000
- Validación en tiempo de creación

### 4. Use Cases (Casos de Uso)

Implementan la lógica de aplicación:

```typescript
@Injectable()
export class CreateRechargeUseCase {
  async execute(createRechargeDto: CreateRechargeDto, userId: number): Promise<Transaction> {
    // 1. Crear transacción
    const savedTransaction = await this.transactionRepository.save(transaction);
    
    // 2. Emitir evento de dominio
    const event = new RechargeSucceededEvent(...);
    await this.eventBus.publish(event);
    
    return savedTransaction;
  }
}
```

### 5. Event Subscribers (Manejadores de Eventos)

Reaccionan a eventos de dominio:

```typescript
@Injectable()
export class RechargeSucceededSubscriber implements OnModuleInit {
  onModuleInit(): void {
    this.eventBus.subscribe('RechargeSucceeded', this.handleRechargeSucceeded.bind(this));
  }

  private async handleRechargeSucceeded(event: RechargeSucceededEvent): Promise<void> {
    // Manejar efectos secundarios:
    // - Enviar SMS al usuario
    // - Actualizar analytics
    // - Enviar webhook al proveedor
  }
}
```

## Flujo de Ejecución

```
POST /api/recharges/buy
    ↓
RechargesController
    ↓
RechargesService.buyRecharge()
    ↓
CreateRechargeUseCase.execute()
    ↓
[1] Crear y guardar Transaction en BD
[2] Emitir RechargeSucceededEvent
    ↓
EventBus.publish(event)
    ↓
RechargeSucceededSubscriber.handleRechargeSucceeded()
    ↓
[Efectos secundarios]
```

## Beneficios de esta Arquitectura

1. **Separación de Responsabilidades**: Lógica de negocio aislada en el dominio
2. **Testabilidad**: Componentes independientes y fáciles de testear
3. **Escalabilidad**: Fácil agregar nuevos eventos y subscribers
4. **Mantenibilidad**: Código organizado por conceptos del negocio
5. **Flexibilidad**: Cambios en la lógica sin afectar la presentación

## Extensiones Futuras

- **Persistencia de Eventos**: Guardar eventos en base de datos para auditoría
- **Event Sourcing**: Reconstruir el estado desde eventos históricos
- **Colas de Mensajes**: Azure Service Bus, RabbitMQ para eventos asincronos
- **Sagas Distribuidas**: Coordinar transacciones entre múltiples agregados
- **Event Snapshots**: Optimizar reconstrucción de estado
- **Dead Letter Queues**: Manejo de eventos fallidos

## Referencias

- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Event-Driven Architecture - Sam Newman](https://github.com/iam-vl/awesome-event-driven-architectures)
- [NestJS Documentation](https://docs.nestjs.com/)
