import {
    MongoClient,
    Db,
    Collection
} from "mongodb"

import { User } from "./models"

const getURL = (): string => {
    return `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT || 27017}`
}

const mongoDB = (db: string = (process.env.DB_NAME || `default`)): Db => {
    const url = getURL()
    console.log(url)
    return new MongoClient(url).db(db)
}

export const getUsers = (): Collection<User> => mongoDB().collection<User>(`users`)
