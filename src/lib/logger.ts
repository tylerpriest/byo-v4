/**
 * Browser-compatible structured logger
 * Provides consistent logging interface with context support
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private context: LogContext
  private minLevel: LogLevel

  constructor(context: LogContext = {}) {
    this.context = context
    this.minLevel = import.meta.env.DEV ? 'debug' : 'info'
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    return levels.indexOf(level) >= levels.indexOf(this.minLevel)
  }

  private formatMessage(level: LogLevel, data: LogContext, message: string): void {
    if (!this.shouldLog(level)) return

    const timestamp = new Date().toISOString()
    const logData = {
      timestamp,
      level,
      ...this.context,
      ...data,
      message,
    }

    const style = {
      debug: 'color: #6b7280',
      info: 'color: #3b82f6',
      warn: 'color: #f59e0b',
      error: 'color: #ef4444; font-weight: bold',
    }[level]

    if (import.meta.env.DEV) {
      console.log(
        `%c[${level.toUpperCase()}] ${message}`,
        style,
        logData
      )
    } else {
      // Production: output JSON
      console.log(JSON.stringify(logData))
    }
  }

  debug(data: LogContext, message: string): void {
    this.formatMessage('debug', data, message)
  }

  info(data: LogContext, message: string): void {
    this.formatMessage('info', data, message)
  }

  warn(data: LogContext, message: string): void {
    this.formatMessage('warn', data, message)
  }

  error(data: LogContext, message: string): void {
    this.formatMessage('error', data, message)
  }

  child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context })
  }
}

export const logger = new Logger()

/**
 * Create a child logger with additional context
 */
export function createLogger(context: LogContext): Logger {
  return logger.child(context)
}

/**
 * Log auth events
 */
export const authLogger = createLogger({ module: 'auth' })

/**
 * Log organization events
 */
export const orgLogger = createLogger({ module: 'organizations' })

/**
 * Log RBAC/permissions events
 */
export const rbacLogger = createLogger({ module: 'rbac' })

/**
 * Log admin actions
 */
export const adminLogger = createLogger({ module: 'admin' })
