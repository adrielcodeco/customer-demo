describe('main', () => {
  beforeAll(() => {
    jest.mock('@nestjs/core', () => {
      const create = jest.fn()
      const listen = jest.fn()
      const app = {
        register: jest.fn(),
        get: jest.fn(),
        useLogger: jest.fn(),
        enableShutdownHooks: jest.fn(),
        listen,
      }
      let resolve
      let called
      create.mockImplementation(() => {
        return app
      })
      listen.mockImplementation(() => {
        resolve && resolve()
        called = true
      })
      ;(listen as any).waitToHaveBeenCalled = () => {
        if (called) {
          return Promise.resolve()
        }
        return new Promise(r => {
          resolve = r
        })
      }
      return {
        NestFactory: {
          listen,
          create,
        },
      }
    })
    jest.mock('src/infrastructure/openapi', () => {
      return {
        useOpenAPI: jest.fn(),
      }
    })
  })

  afterAll(() => {
    jest.unmock('src/infrastructure/openapi')
    jest.unmock('@nestjs/core')
  })

  it('app listening', async () => {
    require('./main')
    const { NestFactory } = require('@nestjs/core')
    await NestFactory.listen.waitToHaveBeenCalled()
    expect(NestFactory.create).toHaveBeenCalled()
    expect(NestFactory.listen).toHaveBeenCalled()
  })
})
