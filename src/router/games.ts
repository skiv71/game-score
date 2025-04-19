import {
    Request,
    Response
} from "express"

import { getCollection } from "../db"

import { Game } from "../db/models"

export async function getGames(
    req: Request,
    res: Response
) {
    const games = await getCollection<Game>(`games`)
        .find()
        .toArray()
    res.send(games)
}

export async function createGame(
    req: Request,
    res: Response
): Promise<void> {
    const name: string = req.body.name || ``
    if (!name) {
        res.status(400).send(`Invalid game name!`)
        return
    }
    const games = getCollection<Game>(`games`)
    if (await games.findOne({ name })) {
        res.status(409).send(`Game already exists!`)
        return
    }
    const game = new Game(name)
    await getCollection<Game>(`games`)
        .insertOne(game)
    res.send(game)
}
