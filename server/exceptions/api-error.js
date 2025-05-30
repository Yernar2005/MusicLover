module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status,  message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
            return new ApiError(401, 'Unauthorized', []);
    }


    static BadRequestError(message, errors=[]) {
        return new ApiError(400, message, errors,);
    }

    static NotFoundError(message) {
        return new ApiError(404, message, []);
    }

    static ForbiddenError(message) {
        return new ApiError(403, message, []);
    }

}