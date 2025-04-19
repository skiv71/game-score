import { ObjectId } from "mongodb"

export interface Model {
    _created: Date,
    _updated: Date
}

export interface Game {
    name: string
}

export interface User {
    email: string
}

export interface Token {
    userId: ObjectId,
    gameId: ObjectId,
    data: string
}
