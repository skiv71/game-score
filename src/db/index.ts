import {
    MongoClient,
    Db,
    Document
} from "mongodb"

import config from "../config"

export interface Model extends Document {
    _id: number,
    _created: Date,
    _updated: Date
}

export function mongoDB(
    url: string = config.MONGODB_URL
): Db {
    return new MongoClient(url).db()
}
