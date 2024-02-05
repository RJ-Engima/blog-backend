import pkg, { createLogger, format, transports, addColors } from 'winston';
import moment from 'moment';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp } = pkg;

const myCustomColors = {
    colors: {
        level: 'green',
        error: 'red'
    }
};

const enumerateErrorFormat = format(info => {
    if (info.message instanceof Error) {
        info.message = Object.assign({
            message: info.message.message,
            stack: info.message.stack,
        }, info.message);
    }
    if (info instanceof Error) {
        return Object.assign({
            message: info.message,
            stack: info.stack,
        }, info);
    }
    return info;
});

const myFormat = format.printf(info => {
    return `${info.level}: ${info.message} || timestamp: ${moment(info.timestamp).format('DD-MM-YYYY h:mm:s A')} `;
});

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        enumerateErrorFormat()
    ),
    transports: [
        new DailyRotateFile({
            format: format.combine(format.simple(), myFormat),
            filename: 'application-logs-%DATE%.log',
            level: 'info',
            maxSize: '20m',
            maxFiles: '100d',
            dirname: './logs/logs'
        }),
        new transports.Console({
            format: format.combine(
                format.colorize(),
                myFormat
            ),
            handleExceptions: true
        })
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// Add custom colors
addColors(myCustomColors.colors);

export default logger;
