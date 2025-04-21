import {
    IModel,
    Model
} from "../model"

import { ObjectId } from "mongodb"

import { randomBytes } from "crypto"

interface IGame extends IModel {
    name: string
}

export class Game extends Model<IGame> {

    public name: string

    constructor(
        game: IGame
    ) {
        super(game)
        this.name = game.name
    }

}

interface IToken extends IModel {
    active?: boolean
    data?: string
    gameId: ObjectId
    userId: ObjectId
}

export class Token extends Model<IToken> {

    public active: boolean
    public data: string
    public gameId: ObjectId
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
        this.userId = token.userId
    }
}

interface IUser {
    email: string
}

export class User extends Model<IUser> {

    public email: string

    constructor(
        user: IUser
    ) {
        super(user)
        this.email = user.email
    }

}
