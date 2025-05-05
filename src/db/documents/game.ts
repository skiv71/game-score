import Mongo from "../mongo"

import Document from "../document"

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

    public static collection(): Mongo.Collection<Game> {
        return Mongo.collection<Game>(`games`)
    }
    public static update(
        update: Document.Update<Game>
    ): Document.UpdateData<Game> {
        return Document.update<Game>(update)
    }

}
