# PuntoRed Backend

API REST para gestión de recargas móviles construida con NestJS y TypeScript.

## Stack Técnico

- NestJS 10.x
- TypeScript 5.x
- SQLite con TypeORM
- JWT Authentication
- class-validator para validaciones

## Instalación

```bash
npm install
```

## Configuración

Crear archivo `.env` en la raíz:

```env
PORT=3000
JWT_SECRET=your-secret-key
JWT_EXPIRATION=24h
TEST_USERNAME=testuser
TEST_PASSWORD=password123
```

## Ejecución

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
npm test
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

## Architecture Decisions

### Clean Architecture
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Database access through TypeORM

### Security
- JWT tokens with configurable expiration
- Password validation (minimum 6 characters)
- Input validation on all endpoints
- CORS enabled for frontend integration

### Validation
- DTO-based validation using class-validator
- Phone number validation (10 digits, starts with 3)
- Amount validation (1000-100000 range)

### Error Handling
- Global exception filter
- Consistent error response format
- HTTP status codes following REST conventions

## Database

The application uses SQLite for simplicity and portability. The database file `database.sqlite` is created automatically on first run.

### Entity: Transaction
```typescript
{
  id: string;           // UUID
  phoneNumber: string;  // 10 digits, starts with 3
  amount: number;       // 1000-100000
  userId: number;       // Reference to user
  createdAt: Date;      // Auto-generated timestamp
}
```

## Hardcoded Test User

For technical test purposes, the application includes a hardcoded user:

- **Username**: testuser
- **Password**: password123

In production, this would be replaced with proper user management and database-stored credentials with password hashing.

## Future Enhancements

- Integration with external recharge provider API
- User registration and management
- Transaction status tracking (pending, completed, failed)
- Email notifications
- Admin dashboard
- Rate limiting
- API documentation with Swagger
- Unit and E2E test coverage
- Docker containerization
- CI/CD pipeline

## License

UNLICENSED - Private project

## Author

PuntoRed Development Team
