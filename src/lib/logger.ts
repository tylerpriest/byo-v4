import pino from 'pino'

// Create browser-compatible logger
const logger = pino({
  browser: {
    asObject: true,
    write: {
      info: (o) => {
        console.info(o)
      },
      error: (o) => {
        console.error(o)
      },
      warn: (o) => {
        console.warn(o)
      },
      debug: (o) => {
        console.debug(o)
      },
      trace: (o) => {
        console.trace(o)
      },
    },
  },
  level: import.meta.env.DEV ? 'debug' : 'info',
})

export { logger }

// Convenience exports
export const log = {
  info: (msg: string, data?: Record<string, unknown>) => logger.info(data, msg),
  error: (msg: string, error?: Error | Record<string, unknown>) => {
    if (error instanceof Error) {
      logger.error({ err: error, message: error.message, stack: error.stack }, msg)
    } else {
      logger.error(error, msg)
    }
  },
  warn: (msg: string, data?: Record<string, unknown>) => logger.warn(data, msg),
  debug: (msg: string, data?: Record<string, unknown>) => logger.debug(data, msg),
  trace: (msg: string, data?: Record<string, unknown>) => logger.trace(data, msg),
}
