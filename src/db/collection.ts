import {
    Collection,
    Document
} from "mongodb"

import Client from "./client"

type Collections = `games` | `tokens` | `users`

export function getCollection<T extends Document>(
    collection: Collections
): Collection<T> {
    return Client
        .db()
        .collection<T>(collection)
}
