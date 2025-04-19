import { ObjectId } from "mongodb"

import { generateToken } from "../token"

class Model {

    public _id: ObjectId
    public _created: Date
    public _updated: Date

    constructor() {
        this._id = new ObjectId()
        const d = new Date
        this._created = d
        this._updated = d
    }

}

export class Game extends Model {

    constructor(
        public name: string
    ) {
        super()
    }
}

export class Token extends Model {

    public active = false
    public data = generateToken()

    constructor(
        public gameId: ObjectId,
        public userId: ObjectId
    ) {
        super()
    }
}

export class User extends Model {

    constructor(
        public email: string
    ) {
        super()
    }
}
