class BaseError extends Error {

    constructor(
        public statusCode: number,
        public statusMessage: string
    ) {
        super()
    }
}

export class ConflictError extends BaseError {

    constructor(
        message = ``
    ) {
        super(409, message)
    }

}

export class ForbiddenError extends BaseError {

    constructor(
        message = ``
    ) {
        super(403, message)
    }

}

export class InvalidError extends BaseError {

    constructor(
        message = ``
    ) {
        super(400, message)
    }

}

export class NotFoundError extends BaseError {

    constructor(
        message = ``
    ) {
        super(404, message)
    }

}

export class UnauthorizedError extends BaseError {

    constructor(
        message = ``
    ) {
        super(401, message)
    }

}
