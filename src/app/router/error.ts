declare global {
    interface Error {
        code: number
    }
}

function customError(
    code: number,
    message: string
): Error {
    const e = new Error(message)
    e.code = code
    return e
}

export const conflictError = (message: string): Error => customError(409, message)

export const forbiddenError = (message: string): Error => customError(403, message)

export const invalidError = (message: string): Error => customError(400, message)

export const notFoundError = (message: string): Error => customError(404, message)
