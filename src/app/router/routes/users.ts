import type {
    NextFunction,
    Request,
    Response
} from "express"

import { User } from "@/db/documents"

import { getResult } from "../lib"

export async function getUsers(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const users = await User.collection().find().toArray()
        res.send(
            getResult<User>(users)
        )
    } catch(e) {
        next(e)
    }
}
