import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthGuard } from 'src/infrastructure/auth.guard'
import { RedisModule, redisProviderKey } from 'src/infrastructure/redis.module'
import { UsecasesModule } from 'src/usecases/usecases.module'
import { Customers } from './customers'

describe('Customers Controller', () => {
  let customers: Customers

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true }), RedisModule.forRoot(), UsecasesModule],
      controllers: [Customers],
      providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
    })
      .overrideProvider(redisProviderKey)
      .useValue({
        get: (id: string) =>
          Promise.resolve(
            id === '12345'
              ? JSON.stringify({
                  id: '12345',
                  name: 'John Doe',
                  document: 94091034012,
                })
              : undefined,
          ),
        set: () => Promise.resolve('OK'),
        exists: () => Promise.resolve(1),
      })
      .compile()
    customers = app.get<Customers>(Customers)
  })

  it('createCustomer with success', async () => {
    expect(
      await customers.createCustomer({
        name: 'John Doe',
        document: 94091034012,
      }),
    ).toMatchObject({
      id: expect.stringMatching(
        /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
      ),
      name: 'John Doe',
      document: 94091034012,
    })
  })
})
