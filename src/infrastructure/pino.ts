import { IncomingMessage } from 'node:http'
import pino from 'pino'
import { Options as PinoOptions } from 'pino-http'

export const pinoHttp: PinoOptions = {
  logger: pino(
    {
      level: process.env.LOG_LEVEL ?? 'info',
      base: null,
      timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
      transport: {
        target: 'pino-pretty',
      },
      formatters: {
        level(label, number) {
          return { level: label }
        },
      },
    },
    pino.destination({ sync: false }),
  ),
  autoLogging: {
    ignore: (req: IncomingMessage & { originalUrl: string }) => {
      return ['/health', '/api'].some(e => req.originalUrl.includes(e))
    },
  },
}
