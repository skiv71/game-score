import {
    NextFunction,
    Request,
    Response,
} from "express"

import {
    ConflictError,
    InvalidError
} from './error'

import Game from "../db/models/game"

export async function createGame(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const games = Game.collection()
        const name: string = req.body.name || ``
        if (!name)
            throw new InvalidError(`Invalid game name!`)
        if (await games.findOne({ name }))
            throw new ConflictError(`Duplicate game name!`)
        const game = new Game.Document({ name })
        await games.insertOne(game)
        res.send(game)
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
