import {
    Request,
    Response
} from "express"

import { getCollection } from "../db"

import { Game } from "../db/models"

import { MESSAGE } from "../config"

export async function getGames(
    req: Request,
    res: Response
) {
    try {
        const games = await getCollection<Game>(`games`)
            .find()
            .toArray()
        res.send(games)
    } catch(e) {
        console.error(e)
        res.status(500).send(MESSAGE.SERVER_ERROR)
    }
}

export async function createGame(
    req: Request,
    res: Response
): Promise<void> {
    try {
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
    } catch(e) {
        console.error(e)
        res.status(500).send(MESSAGE.SERVER_ERROR)
    }
}
