// Simple console-based logger for browser
// Pino has complex browser compatibility, so using a simple wrapper

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface Logger {
  debug: (msg: string, data?: unknown) => void
  info: (msg: string, data?: unknown) => void
  warn: (msg: string, data?: unknown) => void
  error: (msg: string, data?: unknown) => void
}

const isDevelopment = import.meta.env.DEV

function createLogger(): Logger {
  const log = (level: LogLevel, msg: string, data?: unknown) => {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`

    if (data) {
      console[level](prefix, msg, data)
    } else {
      console[level](prefix, msg)
    }
  }

  return {
    debug: (msg, data) => isDevelopment && log('debug', msg, data),
    info: (msg, data) => log('info', msg, data),
    warn: (msg, data) => log('warn', msg, data),
    error: (msg, data) => log('error', msg, data),
  }
}

export const logger = createLogger()
export default logger
