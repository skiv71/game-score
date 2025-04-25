import {
    Db,
    MongoClient,
    type MongoClientOptions
} from "mongodb"

import { MONGO } from "@config"

const url = `mongodb://${MONGO.DB_HOST}:${MONGO.DB_PORT}`

const options: MongoClientOptions = {
    auth: {
        username: MONGO.DB_USER,
        password: MONGO.DB_PASS
    }
}

namespace Mongo {

    export const db = (db: string = MONGO.DB_NAME): Db  => new MongoClient(url, options).db(db)

}

export default Mongo
