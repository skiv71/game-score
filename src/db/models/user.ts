import {
    Collection,
    ObjectId
} from "mongodb"

import Model from "../model"

import { getCollection } from "../collection"

namespace User {

    export interface Schema extends Partial<Model.Schema> {
        email: string
    }

    export const collection = (): Collection<Document> => getCollection<Document>(`users`)

    export class Document extends Model.Document<Schema> implements Schema {

        readonly email: string

        constructor(
            user: Schema
        ) {
            super(user)
            this.email = user.email
        }
        
    }

}

export default User
