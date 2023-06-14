import CustomError from './custom-error'

class UnauthorizedError extends CustomError {
    constructor(message?: string) {
        super(message || 'Unauthorized', 401);
    }
}

export default UnauthorizedError
