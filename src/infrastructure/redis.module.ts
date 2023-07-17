import { DynamicModule, Module, Provider } from '@nestjs/common'
import Redis from 'ioredis'

export type RedisClient = Redis
export const redisProviderKey = Symbol.for('REDIS_CLIENT')

export const RedisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    })
  },
  provide: redisProviderKey,
}

const modules = [RedisProvider]

@Module({})
export class RedisModule {
  static forRoot(): DynamicModule {
    return {
      module: RedisModule,
      providers: modules,
      exports: modules,
      global: true,
    }
  }
}
