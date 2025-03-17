/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import supertest from 'supertest';
import { AppModule } from './../src/app.module';

describe('WeatherController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/weather (GET) - existing city', () => {
    return supertest(app.getHttpServer())
      .get('/weather?city=São Paulo')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('city', 'São Paulo');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('temp');
      });
  });

  it('/weather (GET) - non-existent city', () => {
    return supertest(app.getHttpServer())
      .get('/weather?city=UnknownCity')
      .expect(404)
      .expect((res) => {
        expect(res.body).toEqual({
          statusCode: 404,
          timestamp: expect.any(String),
          path: '/weather?city=UnknownCity',
          message: 'Cidade não encontrada.',
        });
      });
  });

  it('/weather (GET) - city not provided', () => {
    return supertest(app.getHttpServer())
      .get('/weather')
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual({
          statusCode: 400,
          timestamp: expect.any(String),
          path: '/weather',
          message: 'Erro de validação.',
          errors: ['City is required', 'city must be a string'],
        });
      });
  });

  it('/weather (GET) - existing city with language en', () => {
    return supertest(app.getHttpServer())
      .get('/weather?city=São Paulo')
      .set('x-lang', 'en')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('city', 'São Paulo');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('temp');
      });
  });

  it('/weather (GET) - existing city with language pt-BR', () => {
    return supertest(app.getHttpServer())
      .get('/weather?city=São Paulo')
      .set('x-lang', 'pt-BR')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('city', 'São Paulo');
        expect(res.body).toHaveProperty('description');
        expect(res.body).toHaveProperty('temp');
      });
  });
});
