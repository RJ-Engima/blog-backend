import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import {MongoDB} from 'winston-mongodb';
import nodemailer from 'nodemailer';
import pkg from 'winston-mail';
const { createTransport } = pkg;

// Define log levels with colors
const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    debug: 'blue',
  },
};

// Register the custom levels with Winston
winston.addColors(customLevels.colors);

// File Transport
const fileTransport = new DailyRotateFile({
  filename: 'logs/%DATE%-logfile.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

// Database Transport
const databaseTransport = new MongoDB({
  db: 'mongodb://localhost:27017/myapp',
  level: 'info',
  options: { useUnifiedTopology: true }
});

// Email Transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gmail.user@gmail.com',
    pass: 'yourpassword'
  }
});
// const emailTransport = createTransport({
//   transport: transporter,
//   to: 'youremail@example.com',
//   from: 'sender@example.com',
//   subject: 'Error occurred in Blog Application'
// });

// HTTP Transport
const httpTransport = new winston.transports.Http({
  host: 'localhost',
  port: 3000,
  path: '/logs'
});

// Configure Winston logger
const logger = winston.createLogger({
  levels: customLevels.levels,
  format: winston.format.combine(
    winston.format.colorize({ level: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message, null, 2);
      }
      return `${level}: ${message} || ${timestamp} `;
    })
  ),
  transports: [
    new winston.transports.Console(),
    fileTransport,
    databaseTransport,
    // emailTransport,
    httpTransport
  ],
});



export default logger;
