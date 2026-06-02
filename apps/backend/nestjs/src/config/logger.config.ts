import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export function createLogger() {
  return WinstonModule.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console({
        format: process.env.NODE_ENV === 'production'
          ? winston.format.combine(winston.format.timestamp(), winston.format.json())
          : winston.format.combine(winston.format.colorize(), winston.format.simple()),
      }),
    ],
  });
}
