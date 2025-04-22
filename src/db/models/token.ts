import {
    IModel,
    Model,
    ModelIndex
} from "../model"

import { randomBytes } from "crypto"

import { ObjectId } from "mongodb"

interface IToken extends IModel {
    active?: boolean
    data?: string
    gameId: ObjectId
    gameURL?: string
    userId: ObjectId
}

export default class Token extends Model<IToken> {

    public active: boolean
    public data: string
    public gameId: ObjectId
    public gameURL: string
    public userId: ObjectId

    constructor(
        token: IToken
    ) {
        super(token)
        this.active = typeof token.active == `boolean`
            ? token.active
            : false
        this.data = typeof token.data == `string`
            ? token.data
            : randomBytes(32).toString(`hex`)
        this.gameId = token.gameId
        this.gameURL = token.gameURL || ``
        this.userId = token.userId
    }

}

export const tokenNamePrefix = `Token`

const tokenPurge: ModelIndex<IToken> = {
    keys: {
        _created: 1
    },
    options: {
        expireAfterSeconds: 900,
        name: `${tokenNamePrefix}:inactive-purge`,
        partialFilterExpression: {
            active: false
        }
    }
}

export const tokenIndexes: ModelIndex<IToken>[] = [
    tokenPurge
]
