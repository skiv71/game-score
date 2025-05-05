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

    public static collection(): Mongo.Collection<User> {
        return Mongo.collection<User>(`users`)
    }

    public static update(
        update: Document.Update<User>
    ): Document.UpdateData<User> {
        return Document.update<User>(update)
    }

}
