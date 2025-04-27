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
