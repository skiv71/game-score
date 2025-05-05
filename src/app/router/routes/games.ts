import type {
    NextFunction,
    Request,
    Response,
} from "express"

import {
    CustomError,
    ErrorType
} from "../error"

import { Game } from "@/db/documents"

import {
    getResult,
    validRequestBody
} from "../lib"

export async function createGame(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        validRequestBody(req)
        const games = Game.collection()
        const { name = `` } = req.body
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
        const games = await Game.collection().find().toArray()
        res.send(
            getResult<Game>(games)
        )
    } catch(e) {
        next(e)
    }
}
