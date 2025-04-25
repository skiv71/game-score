import type {
    NextFunction,
    Request,
    Response
} from "express"

import User from "@documents/user"

export async function getUsers(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        res.send(
            await User.collection().find().toArray()
        )
    } catch(e) {
        next(e)
    }
}
