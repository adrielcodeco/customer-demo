import fastifyCsrf from '@fastify/csrf-protection'
import helmet from '@fastify/helmet'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Logger } from 'nestjs-pino'
import { AppModule } from 'src/app.module'
import { useOpenAPI } from 'src/infrastructure/openapi'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  })
  await app.register(helmet)
  await app.register(fastifyCsrf)
  app.useLogger(app.get(Logger))
  app.enableShutdownHooks()
  useOpenAPI(app)
  await app.listen(parseInt(process.env.PORT ?? '8000'), '0.0.0.0')
}

bootstrap().catch(console.error.bind(console))
