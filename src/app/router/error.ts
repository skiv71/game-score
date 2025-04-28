import type {
    Errback,
    NextFunction,
    Request,
    Response,
} from 'express'

export enum ErrorType {
    InvalidRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409
}

export class CustomError extends Error {

    public code: number

    constructor(
        type: ErrorType,
        message: string = ``
    ) {
        super(message)
        this.code = type
    }

}

export function errorHandler(
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err) {
        res.status(err.code).send(err.message)
        console.error(err)
        return
    }
}
