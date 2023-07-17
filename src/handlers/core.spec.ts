import { TerminusModule } from '@nestjs/terminus'
import { Test, TestingModule } from '@nestjs/testing'
import { Core } from './core'

describe('Core Controller', () => {
  let core: Core

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [Core],
    }).compile()

    core = app.get<Core>(Core)
  })

  it('healthcheck with success', async () => {
    expect(await core.healthCheck()).toMatchObject({
      status: 'ok',
      info: {
        storage: {
          status: 'up',
        },
        // memory_heap: {
        //   status: 'up',
        // },
        // memory_rss: {
        //   status: 'up',
        // },
      },
      error: {},
      details: {
        storage: {
          status: 'up',
        },
        // memory_heap: {
        //   status: 'up',
        // },
        // memory_rss: {
        //   status: 'up',
        // },
      },
    })
  })
})
