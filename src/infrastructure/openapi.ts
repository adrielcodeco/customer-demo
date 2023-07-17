import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

export const useOpenAPI = (app: NestFastifyApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Customer API')
    .setDescription('Customer API Demo')
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
}
