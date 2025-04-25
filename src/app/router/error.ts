export enum ErrorType {
    InvalidRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409
}

export class CustomError extends Error {

    public statusCode: number

    constructor(
        type: ErrorType,
        message: string = ``
    ) {
        super(message)
        this.statusCode = type
    }

}
