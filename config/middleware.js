// customMiddleware.js
export const customMiddleware = (req, res, next) => {
    // Custom response object to maintain consistency
    res.success = (status, message, data) => {
        const statusCode = status || 200
        res.status(statusCode).json({
            status: statusCode,
            message: message || "Success",
            data,
        });
    };

    // Custom error response object
    res.error = (status, message, error ) => {
        const statusCode = status || 500
        res.status(status).json({
            status: statusCode,
            message: message || 'Internal Server Error',
            error: error
        });
    };

    next();
};

