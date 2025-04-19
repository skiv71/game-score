import {
    Request,
    Response
} from "express"

import {
    Collection,
    Document
} from "mongodb"

import { MESSAGE } from "../config"

export function getDocuments<T extends Document>(
    collection: Collection<T>
) {
    return async function(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            res.send(await collection.find().toArray())
        } catch(e) {
            console.error(e)
            res.status(500).send(MESSAGE.SERVER_ERROR)
        }
    }
}
