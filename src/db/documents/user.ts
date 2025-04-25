import { type Collection } from "mongodb"

import Document from "../document"

import Mongo from "../mongo"

type UserSchema = {
    email: string
} & Partial<Document.Metadata>

export default class User extends Document.Class<UserSchema> implements UserSchema {

    readonly email: string

    constructor(
        user: UserSchema
    ) {
        super(user)
        this.email = user.email
    }

    static collection(): Collection<User> {
        return Mongo.db().collection<User>(`users`)
    }

}
