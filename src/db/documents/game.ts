import { type Collection } from "mongodb"

import Document from "../document"

import Mongo from "../mongo"

import { MONGO } from "@config"

type GameSchema = {
    name: string
} & Partial<Document.Metadata>

export default class Game extends Document.Class<GameSchema> implements GameSchema {

    readonly name: string

    constructor(
        game: GameSchema
    ) {
        super(game)
        this.name = game.name
    }

    static collection(): Collection<Game> {
        return Mongo.db().collection<Game>(`games`)
    }

}
