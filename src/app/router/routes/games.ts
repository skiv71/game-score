import type {
    NextFunction,
    Request,
    Response,
} from "express"

import {
    CustomError,
    ErrorType
} from "../error"

import Game from "@documents/game"

export async function createGame(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const games = Game.collection()
        const name: string = req.body.name || ``
        if (!name)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid game name!`)
        if (await games.findOne({ name }))
            throw new CustomError(ErrorType.Conflict, `Duplicate game name!`)
        const game = new Game({ name })
        res.send(
            await games.insertOne(game)
        )
    } catch(e) {
        next(e)
    }
}

export async function getGames(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        res.send(
            await Game.collection().find().toArray()
        )
    } catch(e) {
        next(e)
    }
}
