import winston from 'winston';

export const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

process.on('uncaughtException', async (err) => {
  const errorMessage = `Uncaught Exception: ${err.message}\n${err.stack}`;
  logger.error(errorMessage);
});

process.on('unhandledRejection', async (reason, promise) => {
  const errorMessage = `Unhandled Rejection at: ${promise}\nReason: ${reason}`;
  logger.error(errorMessage);
});
