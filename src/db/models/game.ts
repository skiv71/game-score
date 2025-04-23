import { Collection } from "mongodb"

import Model from "../model"

import { getCollection } from "../collection"

namespace Game {

    export interface Schema extends Partial<Model.Schema> {
        name: string
    }

    export const collection = (): Collection<Document> => getCollection<Document>(`games`)

    export class Document extends Model.Document<Schema> implements Schema {

        readonly name: string

        constructor(
            game: Schema
        ) {
            super(game)
            this.name = game.name
        }
        
    }

}

export default Game
