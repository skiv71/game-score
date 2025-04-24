import {
    Collection,
    IndexDescriptionInfo,
    ObjectId,
} from "mongodb"

import { randomBytes } from "crypto"

import Model from "../model"

import { getCollection } from "../collection"

namespace Token {

    export interface Schema extends Partial<Model.Schema> {
        active?: boolean
        data?: string
        gameId: ObjectId
        gameURL?: string
        userId: ObjectId
    }

    export const collection = (): Collection<Document> => getCollection<Document>(`tokens`)

    export class Document extends Model.Document<Schema> implements Schema {

        readonly active: boolean
        readonly data: string
        readonly gameId: ObjectId
        readonly gameURL: string
        readonly userId: ObjectId

        constructor(
            token: Schema
        ) {
            super(token)
            this.active = typeof token.active == `boolean`
                ? token.active
                : false
            this.data = token.data || randomBytes(32).toString(`hex`)
            this.gameId = token.gameId
            this.gameURL = token.gameURL || ``
            this.userId = token.userId
        }

    }

    export const indexes: Model.Index<Schema>[] = [
        {
            keys: {
                _created: 1
            },
            options: {
                expireAfterSeconds: 1800,
                name: `Token:inactive-purge`,
                partialFilterExpression: {
                    active: false
                }
            }
        }
    ]

}

export default Token

export async function tokenIndexes(): Promise<IndexDescriptionInfo[]> {
    const tokens = Token.collection()
    const indexList = [...await tokens.indexes()]
        .filter(o => !o.name?.includes(`_id`))
    await Promise.all(
        indexList
            .map(o => tokens.dropIndex(o.name!))
    )
    await Promise.all(
        Token.indexes
            .map(o => tokens.createIndex(o.keys, o.options))
    )
    return tokens.indexes()
}
