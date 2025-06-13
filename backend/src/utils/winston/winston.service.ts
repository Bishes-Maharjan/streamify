/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, LoggerService } from '@nestjs/common';
import { ensureDirSync } from 'fs-extra';
import * as path from 'path';
import { createLogger, format, transports } from 'winston';
@Injectable()
export class WinstonLoggerService implements LoggerService {
  constructor() {
    //ensures the logs directory exists
    ensureDirSync(path.join(process.cwd(), 'logs/error'));
    ensureDirSync(path.join(process.cwd(), 'logs/combined'));
  }

  private readonly logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD, HH:mm:ss A Z',
      }),
      format.errors({ stack: true }),
      format.printf(({ timestamp, level, message, stack, ...rest }) => {
        const msg =
          typeof message === 'object'
            ? JSON.stringify(message, null, 2)
            : message;
        const details =
          typeof rest === 'object' ? JSON.stringify(rest, null, 2) : rest;
        return `\n[${timestamp}] [${level}]: ${msg}\nDetails: ${details} ${stack ? `\nStack:\n${stack}` : ''} \n`;
      }),
    ),
    transports: [
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.errors({ stack: true }),
          format.printf(({ timestamp, level, message, stack, ...rest }) => {
            const msg =
              typeof message === 'object'
                ? JSON.stringify(message, null, 2)
                : message;
            const details =
              typeof rest === 'object' ? JSON.stringify(rest, null, 2) : rest;
            return `\n[${timestamp}] [${level}]: ${msg}\nDetails: ${details} ${stack ? `\nStack:\n${stack}` : ''} \n`;
          }),
        ),
      }),
      new transports.File({
        filename: this.getDailyLogPath('error'), //error log file
        level: 'error',
      }),
      new transports.File({ filename: this.getDailyLogPath('combined') }), //combined log file
    ],
  });

  private getDailyLogPath(logType: string): string {
    const today = new Date().toISOString().split('T')[0];
    return path.join(process.cwd(), 'logs', logType, `${today}.txt`);
  }

  log(message: any) {
    this.logger.info(message);
  }

  error(message: any) {
    this.logger.error(message);
  }

  warn(message: any) {
    this.logger.warn(message);
  }

  debug(message: any) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}
