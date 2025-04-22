import {
    MongoClient,
    MongoClientOptions
} from "mongodb"

import { MONGO } from "../config"

const options: MongoClientOptions = {
    auth: {
        username: MONGO.DB_USER,
        password: MONGO.DB_PASS
    }
}

const url = `mongodb://${MONGO.DB_HOST}:${MONGO.DB_PORT}`

export default class Client extends MongoClient {

    constructor() {
        super(url, options)
    }

}
