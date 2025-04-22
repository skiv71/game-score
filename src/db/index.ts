import {
    Collection,
    ObjectId,
    IndexDescriptionInfo
} from "mongodb"

import Client from "./client"

import { MONGO } from "../config"

import { Model } from "./model"

import Token, {
    tokenIndexes,
    tokenNamePrefix
} from "./models/token"

export const collections = [`games`, `tokens`, `users`] as const

export type Collections = typeof collections[number]

export function getCollection<T extends Model<T>>(
    collection: Collections
): Collection<T> {
    return new Client()
        .db(MONGO.DB_NAME)
        .collection<T>(collection)
}

export function documentId(
    id?: string
): ObjectId | null {
    return id
        ? ObjectId.isValid(id) ? new ObjectId(id) : null
        : new ObjectId()
}

async function tokensCollectionIndexes(): Promise<void> {
    const tokens = getCollection<Token>(`tokens`)
    const indexList = [...await tokens.indexes()]
        .filter(o => o.name?.includes(tokenNamePrefix))
    await Promise.all(
        indexList
            .map(o => tokens.dropIndex(o.name!))
    )
    await Promise.all(
        tokenIndexes
            .map(o => tokens.createIndex(o.keys, o.options)) 
    )
}

export async function mongoIndexes(): Promise<IndexDescriptionInfo[]> {
    await tokensCollectionIndexes()
    return getCollection<Token>(`tokens`).indexes()
}
