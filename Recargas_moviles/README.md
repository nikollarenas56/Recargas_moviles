# PuntoRed Backend

API REST para gestión de recargas móviles construida con NestJS y TypeScript.

## Librerías utilizadas

Framework y arquitectura:
- NestJS 10.x (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`, `@nestjs/config`)
- TypeScript 5.x

Persistencia:
- TypeORM (`typeorm`, `@nestjs/typeorm`)
- SQLite (`sqlite3`)

Autenticación y seguridad:
- JWT (`@nestjs/jwt`)
- Passport (`passport`, `passport-jwt`, `@nestjs/passport`)

Validación:
- `class-validator`
- `class-transformer`

Pruebas:
- Jest (`jest`, `ts-jest`, `@nestjs/testing`)
- Supertest (`supertest`)

## Instrucciones de ejecución

### Requisitos

- Node.js 18 o superior
- npm 9 o superior

### Instalación

```bash
npm install
```

### Configuración

Crear archivo `.env` en la raíz con este contenido base:

```env
PORT=3000
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
TEST_USERNAME=testuser
TEST_PASSWORD=password123
```

### Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La API estará disponible en `http://localhost:3000/api`

## Endpoints

### Autenticación

**POST /api/auth/login**

Credenciales de prueba:
- username: `testuser`
- password: `password123`

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testuser"
  }
}
```

### Recargas

**POST /api/recharges/buy** (requiere autenticación)

Headers: `Authorization: Bearer <token>`

Body:
```json
{
  "phoneNumber": "3001234567",
  "amount": 5000
}
```

Validaciones:
- phoneNumber: 10 dígitos, debe iniciar con 3
- amount: entre 1000 y 100000

**GET /api/recharges/history** (requiere autenticación)

Headers: `Authorization: Bearer <token>`

Retorna el historial de transacciones del usuario autenticado.

## Tests

```bash
# Unit tests
npm test

# Unit tests with watch mode
npm run test:watch

# Unit tests with coverage
npm run test:cov

# End-to-end tests
npm run test:e2e
```

### Cobertura de pruebas

El proyecto incluye pruebas automatizadas con Jest para:

- Pruebas unitarias de `AuthService`
- Pruebas unitarias de `CreateRechargeUseCase`
- Reglas de dominio en `PhoneNumber` y `Amount`
- Pruebas e2e de autenticación y recargas
- Escenarios de éxito (2xx)
- Escenarios de error del cliente (4xx)
- Escenario de error del servidor (5xx)

Resultados verificados:
- Unitarias: 15/15 passing
- E2E: 10/10 passing

Si PowerShell bloquea scripts de `npm` por la política de ejecución, ejecuta Jest directamente:

```bash
node node_modules/jest/bin/jest.js --runInBand
node node_modules/jest/bin/jest.js --config test/jest-e2e.json --runInBand
```

## Justificación breve de las decisiones técnicas

- NestJS + TypeScript: estructura modular, mantenible y adecuada para un backend escalable.
- SQLite + TypeORM: implementación rápida para la prueba técnica, con persistencia local simple y suficiente.
- JWT: protección estándar para endpoints privados sin manejar sesión en servidor.
- DDD + Event-Driven Design: separación clara entre dominio, aplicación e infraestructura para facilitar evolución del código.
- Value Objects (`PhoneNumber`, `Amount`): reglas de negocio centralizadas y consistentes.
- Unit tests + e2e: validan tanto lógica interna como comportamiento real de la API por HTTP.

## Arquitectura y criterios técnicos

### Arquitectura limpia
- **Controladores**: manejan peticiones y respuestas HTTP.
- **Servicios**: concentran la lógica de negocio.
- **Repositorios**: acceso a base de datos con TypeORM.

### Seguridad
- Tokens JWT con expiración configurable.
- Validación de contraseña (mínimo 6 caracteres).
- Validación de entrada en todos los endpoints.
- CORS habilitado para integración con frontend.

### Validación
- Validación con DTO usando class-validator.
- Validación de número celular (10 dígitos, inicia en 3).
- Validación de monto (rango 1000-100000).

### Manejo de errores
- Filtro global de excepciones.
- Formato de error consistente.
- Códigos HTTP siguiendo convenciones REST.

## Base de datos

La aplicación usa SQLite por simplicidad y portabilidad. El archivo `database.sqlite` se crea automáticamente en la primera ejecución.

### Entidad: Transaction
```typescript
{
  id: string;           // UUID
  phoneNumber: string;  // 10 digits, starts with 3
  amount: number;       // 1000-100000
  userId: number;       // Reference to user
  createdAt: Date;      // Auto-generated timestamp
}
```

## Usuario de prueba

Para la prueba técnica se incluye un usuario fijo:

- **Username**: testuser
- **Password**: password123

En un entorno productivo, este usuario se reemplaza por gestión real de usuarios con contraseñas cifradas en base de datos.

## Mejoras futuras

- Integración con proveedor externo de recargas.
- Registro y gestión de usuarios.
- Seguimiento de estado de transacciones (pendiente, completada, fallida).
- Notificaciones por correo.
- Panel administrativo.
- Rate limiting.
- Documentación de API con Swagger.
- Mayor cobertura de pruebas unitarias y e2e.
- Contenerización con Docker.
- Pipeline CI/CD.

## Licencia

UNLICENSED - Private project

## Autor

PuntoRed Development Team
