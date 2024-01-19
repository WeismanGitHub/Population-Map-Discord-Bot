import CustomError from './custom-error';

class ConflictError extends CustomError {
    constructor(message?: string) {
        super(message || 'Conflict', 409);
    }
}

export default ConflictError;
