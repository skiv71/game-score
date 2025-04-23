import {
    MongoClient,
    MongoClientOptions
} from "mongodb"

import { MONGO } from "../config"

namespace Client {

    const options: MongoClientOptions = {
        auth: {
            username: MONGO.DB_USER,
            password: MONGO.DB_PASS
        }
    }
    
    const url = `mongodb://${MONGO.DB_HOST}:${MONGO.DB_PORT}`

    export const db = (db: string = MONGO.DB_NAME) => new MongoClient(url, options).db(db)

}

export default Client
