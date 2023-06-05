import CustomError from './custom-error'

class InternalServerError extends CustomError {
    constructor(message?: string) {
        super(message || 'Internal Server', 500);
    }
}

export default InternalServerError
