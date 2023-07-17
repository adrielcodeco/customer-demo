import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { LoggerModule } from 'nestjs-pino'
import { HandlersModule } from 'src/handlers.module'
import { RedisModule } from 'src/infrastructure/redis.module'
import { pinoHttp } from 'src/infrastructure/pino'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({ pinoHttp }),
    RedisModule.forRoot(),
    HandlersModule,
  ],
})
export class AppModule {}
