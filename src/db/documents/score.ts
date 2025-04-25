import {
    type Collection,
    type ObjectId
} from "mongodb"

import Document from "../document"

import Mongo from "../mongo"

type ScoreSchema = {
    gameId: ObjectId,
    name: string,
    value: number,
    userId: ObjectId
} & Partial<Document.Metadata>

export default class Score extends Document.Class<ScoreSchema> implements ScoreSchema {

    readonly gameId: ObjectId
    readonly name: string
    readonly value: number
    readonly userId: ObjectId

    constructor(
        score: ScoreSchema
    ) {
        super(score)
        this.gameId = score.gameId
        this.name = score.name
        this.value = score.value
        this.userId = score.userId
    }

    static collection(): Collection<Score> {
        return Mongo.db().collection<Score>(`scores`)
    }

}
