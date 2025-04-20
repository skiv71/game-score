import {
    MongoClient,
    MongoClientOptions,
    Db,
    Collection,
    ObjectId
} from "mongodb"

import { MONGO } from "../config"

import { Model } from "./models"

interface Client {
    url: string
    options: MongoClientOptions
}

const client: Client = {
    get options() {
        return {
            auth: {
                username: MONGO.DB_USER,
                password: MONGO.DB_PASS
            }
        } as const
    },
    get url() {
        return `mongodb://${MONGO.DB_HOST}:${MONGO.DB_PORT}`
    }
}

export const mongoDB = (): Db => new MongoClient(client.url, client.options).db(MONGO.DB_NAME)

export type Collections = `games` | `tokens` | `users`

export function getCollection<T extends Model>(
    collection: Collections
): Collection<T> {
    return mongoDB()
        .collection<T>(collection)
}

export function documentId(
    id?: string
): ObjectId | null {
    return id
        ? ObjectId.isValid(id) ? new ObjectId(id) : null
        : new ObjectId()
}
