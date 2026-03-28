import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from './../src/common/filters/http-exception.filter';
import { RechargesService } from './../src/recharges/recharges.service';

describe('Recharge API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'password123' })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toEqual({ id: 1, username: 'testuser' });
    });

    it('should reject invalid credentials with 401', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testuser', password: 'wrongpassword' })
        .expect(401);
    });

    it('should validate missing password with 400', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'testuser' })
        .expect(400);
    });
  });

  describe('POST /api/recharges/buy', () => {
    it('should create a recharge with valid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/recharges/buy')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          phoneNumber: '3001234567',
          amount: 5000,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.phoneNumber).toBe('3001234567');
      expect(response.body.amount).toBe(5000);
      expect(response.body.userId).toBe(1);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should reject missing token with 401', async () => {
      await request(app.getHttpServer())
        .post('/api/recharges/buy')
        .send({ phoneNumber: '3001234567', amount: 5000 })
        .expect(401);
    });

    it('should reject invalid phone number with 400', async () => {
      await request(app.getHttpServer())
        .post('/api/recharges/buy')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phoneNumber: '2001234567', amount: 5000 })
        .expect(400);
    });

    it('should reject amount below minimum with 400', async () => {
      await request(app.getHttpServer())
        .post('/api/recharges/buy')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phoneNumber: '3001234567', amount: 999 })
        .expect(400);
    });
  });

  describe('GET /api/recharges/history', () => {
    it('should return the authenticated user history', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/recharges/history')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject unauthenticated requests with 401', async () => {
      await request(app.getHttpServer())
        .get('/api/recharges/history')
        .expect(401);
    });
  });
});

describe('Recharge API server errors (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(RechargesService)
      .useValue({
        buyRecharge: jest
          .fn()
          .mockRejectedValue(new InternalServerErrorException('Unexpected failure')),
        getHistory: jest.fn().mockResolvedValue([]),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 500 when an unexpected server error happens during recharge creation', async () => {
    await request(app.getHttpServer())
      .post('/api/recharges/buy')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        phoneNumber: '3001234567',
        amount: 5000,
      })
      .expect(500);
  });
});
