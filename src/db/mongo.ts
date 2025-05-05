import { MongoClient } from "mongodb"

import type {
    Collection as MongoCollection,
    Document,
    MongoClientOptions,
    ObjectId as MongoObjectId
} from "mongodb"

import config from "@/config"

export { default as MongoDocument } from './document'

namespace Mongo {

    export type Collection<T extends Document> = MongoCollection<T>

    export type CollectionName = `games` | `scores` | `tokens` | `users`

    export type ClientOptions = MongoClientOptions

    export type ObjectId = MongoObjectId

    export const options: Mongo.ClientOptions = {
        auth: {
            username: config.MONGO.DB_USER,
            password: config.MONGO.DB_PASS
        },
        maxIdleTimeMS: 120e3
    } as const

    export function collection<T extends Document>(
        name: Mongo.CollectionName
    ): Mongo.Collection<T> {
        return Mongo.client
            .db(config.MONGO.DB_NAME)
            .collection<T>(name)
    }

    export const url = `mongodb://${config.MONGO.DB_HOST}:${config.MONGO.DB_PORT}` as const

    export const client = new MongoClient(Mongo.url, Mongo.options)

}

Mongo.client.on(`open`, () => {
    console.log(`mongo:open`)
})

Mongo.client.on(`close`, () => {
    console.log(`mongo:close`)
})

export default Mongo
