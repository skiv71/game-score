import {
    type Collection,
    type IndexDescriptionInfo,
    type ObjectId
} from "mongodb"

import Document from "../document"

import Mongo from "../mongo"

import { randomBytes } from "crypto"

type TokenSchema = {
    active: boolean
    data?: string
    gameId: ObjectId
    gameURL?: string
    userId: ObjectId
} & Partial<Document.Metadata>

const indexes: Document.Index<TokenSchema>[] = [
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

export default class Token extends Document.Class<TokenSchema> implements TokenSchema {

    readonly active: boolean
    readonly data: string
    readonly gameId: ObjectId
    readonly gameURL?: string | undefined
    readonly userId: ObjectId

    constructor(
        token: TokenSchema
    ) {
        super(token)
        this.active = token.active
        this.data = token.data || Token.data()
        this.gameId = token.gameId
        this.userId = token.userId
    }

    public static collection(): Collection<Token> {
        return Mongo.db().collection<Token>(`tokens`)
    }

    public static data(): string {
        return randomBytes(32).toString(`hex`)
    }

    public static async indexes(): Promise<IndexDescriptionInfo[]> {
        const tokens = Token.collection()
        const indexList = [...await tokens.indexes()]
            .filter(o => !o.name?.includes(`_id`))
        await Promise.all(
            indexList
                .map(o => tokens.dropIndex(o.name!))
        )
        await Promise.all(
            indexes
                .map(o => tokens.createIndex(o.keys, o.options))
        )
        return tokens.indexes()
    }
    
}
