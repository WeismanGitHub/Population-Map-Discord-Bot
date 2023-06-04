export default class CustomError extends Error {
    constructor(message?: string, statusCode?: number) {
        super(message || 'Something went wrong!')
        this.statusCode = statusCode || 500
    }
    
    statusCode: number;
}