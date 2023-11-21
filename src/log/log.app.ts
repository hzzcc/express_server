import dayJs from 'dayjs';
import { join } from 'path';
import { createLogger, format, Logger as WinstonLogger, transports } from 'winston';

import { LOG_PATH, LOG_TIME_FORMAT } from './constants';

const { combine, printf } = format;
export type ErrorType = Error | string | Record<string, any>;

const winstonLogger: WinstonLogger = createLogger({
  format: combine(
    printf(
      // 日志信息格式化
      (info) => {
        const time = dayJs().format(LOG_TIME_FORMAT);
        return `[datapp_bff] [pid: ${process.pid}] ${time} ${info.level.toUpperCase()} ${
          info.message
        }`;
      },
    ),
  ),
  exitOnError: false,
  transports: [
    // 控制台配置
    new transports.Console({
      level: 'info',
      handleExceptions: false,
    }),
  ],
});

export const addTransportFile = (level: string) => {
  winstonLogger.add(
    new transports.File({
      level: level,
      filename: join(LOG_PATH, 'datapp_bff.log'),
      maxsize: 1024 * 1024 * 500, // 500M切割
    }),
  );
};

export class LogApp {
  static debug(message: ErrorType, meta?: any): WinstonLogger {
    return winstonLogger.debug(LogApp.serialize(message), meta);
  }

  static info(message: ErrorType, meta?: any): WinstonLogger {
    return winstonLogger.info(LogApp.serialize(message), meta);
  }

  static warn(message: ErrorType, meta?: any): WinstonLogger {
    return winstonLogger.warn(LogApp.serialize(message), meta);
  }

  static error(message: ErrorType, meta?: any): WinstonLogger {
    return winstonLogger.error(LogApp.serialize(message), meta);
  }

  static verbose(message: ErrorType, meta?: any): WinstonLogger {
    return winstonLogger.verbose(LogApp.serialize(message), meta);
  }

  static serialize(msg: ErrorType): string {
    if (typeof msg === 'string') {
      return msg;
    }

    if (msg instanceof Error && msg.stack) {
      return msg.stack;
    }

    return JSON.stringify(msg);
  }
}
