import CustomError from './custom-error'

class TooManyRequestsError extends CustomError {
    constructor(message?: string) {
        super(message || 'Too Many Requests Error', 429);
    }
}

export default TooManyRequestsError
