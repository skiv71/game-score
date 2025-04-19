import {
    Request,
    Response
} from "express"

import db from "../db"

export async function getGames(
    req: Request,
    res: Response
) {
    const games = await db.games().find().toArray()
    res.send({ games })
}
