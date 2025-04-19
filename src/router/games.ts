import {
    Request,
    Response
} from "express"

import { getCollection } from "../db"

import { Game } from "../db/models"

import { getDocuments } from "./shared"

import { MESSAGE } from "../config"

export const getGames = getDocuments(
    getCollection<Game>(`games`)
)

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
