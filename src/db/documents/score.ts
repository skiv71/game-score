import Mongo from "../mongo"

import Document from "../document"

type ScoreSchema = {
    gameId: Mongo.ObjectId,
    level: number,
    name: string,
    value: number,
    userId: Mongo.ObjectId
} & Partial<Document.Metadata>

export default class Score extends Document.Class<ScoreSchema> implements ScoreSchema {

    readonly gameId: Mongo.ObjectId
    readonly level: number
    readonly name: string
    readonly value: number
    readonly userId: Mongo.ObjectId

    constructor(
        score: ScoreSchema
    ) {
        super(score)
        this.gameId = score.gameId
        this.level = +score.level
        this.name = score.name
        this.value = +score.value
        this.userId = score.userId
    }

    public static collection(): Mongo.Collection<Score> {
        return Mongo.collection<Score>(`scores`)
    }

    public static update(
        update: Document.Update<Score>
    ): Document.UpdateData<Score> {
        return Document.update<Score>(update)
    }

}
