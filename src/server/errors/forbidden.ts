import CustomError from './custom-error'

class ForbiddenError extends CustomError {
    constructor(message?: string) {
        super(message || 'Forbidden', 403);
    }
}

export default ForbiddenError
