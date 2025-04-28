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

const SERVER_ERROR = `A server error has occurred!`

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err) {
        if (err instanceof CustomError) {
            res.status(err.code).send(err.message)
            console.error(err)
        } else if (err instanceof Error) {
            res.status(500).send(SERVER_ERROR)
            console.error(err.stack)
        } else {
            res.status(500).send(SERVER_ERROR)
            console.error(err)
        }
    } else {
        next()
    }
}
