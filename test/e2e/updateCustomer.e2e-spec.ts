process.env.LOG_LEVEL = 'silent'
import { ConfigService } from '@nestjs/config'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { Configurations } from 'src/infrastructure/configurations'
import { useOpenAPI } from 'src/infrastructure/openapi'
import { redisProviderKey } from 'src/infrastructure/redis.module'
import * as request from 'supertest'
import { getToken } from 'test/libs/auth'
import { redisModuleMock } from 'test/mock/redis'

describe('updateCustomer (e2e)', () => {
  let app: NestFastifyApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(redisProviderKey)
      .useValue(redisModuleMock)
      .compile()
    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter())
    useOpenAPI(app)
    await app.init()
    await app.getHttpAdapter().getInstance().ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('/customers (PUT) - 200', async () => {
    const token = await getToken()
    expect(token).toBeDefined()
    await request(app.getHttpServer())
      .put(`/customers/12345`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: '12345', document: 93250765007, name: 'john doe 2' })
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body).toMatchObject({
          id: '12345',
          document: 93250765007,
          name: 'john doe 2',
        })
      })
  })

  it('/customers (PUT) - 400 request inválida', async () => {
    const token = await getToken()
    expect(token).toBeDefined()
    await request(app.getHttpServer())
      .put(`/customers/12345`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: '12345', document: 99999999999, name: 'john doe' })
      .expect(400)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body).toMatchObject({
          error: 'Bad Request',
          message: 'request inválida',
          statusCode: 400,
        })
      })
  })

  it('/customers (PUT) - 401 não autorizado', async () => {
    await request(app.getHttpServer())
      .put(`/customers/12345`)
      .set('Authorization', `Bearer xxx`)
      .send({ id: '12345', document: 93250765007, name: 'john doe' })
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body).toMatchObject({
          error: 'Unauthorized',
          message: 'não autorizado',
          statusCode: 401,
        })
      })
  })

  it('/customers (PUT) - 404 cliente inexistente', async () => {
    const token = await getToken()
    expect(token).toBeDefined()
    await request(app.getHttpServer())
      .put(`/customers/00000`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: '00000', document: 93250765007, name: 'john doe' })
      .expect(404)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body).toMatchObject({
          error: 'Not Found',
          message: 'cliente inexistente',
          statusCode: 404,
        })
      })
  })

  it('/customers (PUT) - 409 conflito de ID', async () => {
    const token = await getToken()
    expect(token).toBeDefined()
    await request(app.getHttpServer())
      .put(`/customers/12345`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: '00000', document: 93250765007, name: 'john doe' })
      .expect(409)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body).toMatchObject({
          error: 'Conflict',
          message: 'conflito de ID',
          statusCode: 409,
        })
      })
  })

  it('/customers (POST) - 502 cache indisponível', async () => {
    const token = await getToken()
    expect(token).toBeDefined()
    await request(app.getHttpServer())
      .put(`/customers/12345`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: '12345', document: 23750787050, name: 'john doe' })
      .expect(502)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body).toMatchObject({
          error: 'Bad Gateway',
          message: 'cache indisponível',
          statusCode: 502,
        })
      })
  })

  it('/customers (POST) - 502 sso indisponível', async () => {
    const token = await getToken()
    expect(token).toBeDefined()
    const configService = app.get(ConfigService<Configurations>)
    jest.spyOn(configService, 'get').mockImplementation(() => '')
    await request(app.getHttpServer())
      .put(`/customers/12345`)
      .set('Authorization', `Bearer ${token}`)
      .send({ id: '12345', document: 93250765007, name: 'john doe' })
      .expect(502)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body).toMatchObject({
          error: 'Bad Gateway',
          message: 'sso indisponível',
          statusCode: 502,
        })
      })
  })
})
