const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        // Ensure the status code is valid (3-digit number between 100 and 599)
        const statusCode = (error.code && error.code >= 100 && error.code <= 599) ? error.code : 400;
        
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }
}

export { asyncHandler };
