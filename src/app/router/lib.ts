import {
    CustomError,
    ErrorType
} from "./error"

import { type Request } from 'express'

export function validRequestBody(
    req: Request
): void {
    if (typeof req.body != `object`)
        throw new CustomError(ErrorType.InvalidRequest)
}

type Result<T> = {
    data: T[],
    count: number
}

export function getResult<T>(
    data: T[]
): Result<T> {
    return {
        data,
        count: data.length
    }
}
