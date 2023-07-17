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

describe('createCustomer (e2e)', () => {
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

  it('/customers (POST) - 201', async () => {
    const token = await getToken()
    expect(token).toBeDefined()
    await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ document: 93250765007, name: 'john doe' })
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .then(response => {
        expect(response.body).toMatchObject({
          id: expect.stringMatching(
            /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
          ),
          document: 93250765007,
          name: 'john doe',
        })
      })
  })

  it('/customers (POST) - 400 request inválida', async () => {
    const token = await getToken()
    expect(token).toBeDefined()
    await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ document: 99999999999, name: 'john doe' })
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

  it('/customers (POST) - 401 não autorizado', async () => {
    await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer xxx`)
      .send({ document: 93250765007, name: 'john doe' })
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

  it('/customers (POST) - 502 cache indisponível', async () => {
    const token = await getToken()
    expect(token).toBeDefined()
    await request(app.getHttpServer())
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ document: 23750787050, name: 'john doe' })
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
      .post('/customers')
      .set('Authorization', `Bearer ${token}`)
      .send({ document: 93250765007, name: 'john doe' })
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
