import {
    MongoClientOptions,
    Auth,
    MongoClient,
    Db,
    Collection
} from "mongodb"

import { User } from "./models"

import { MONGO } from "../config"

const getURL = (): string => `mongodb://${MONGO.DB_HOST}:${MONGO.DB_PORT}`

const mongoDB = (): Db => {
    const url = getURL()
    console.log(url)
    const options: MongoClientOptions = {
        auth: {
            username: MONGO.DB_USER,
            password: MONGO.DB_PASS
        }
    }
    console.log({ options })
    return new MongoClient(url, options).db(MONGO.DB_NAME)
}

export const getUsers = (): Collection<User> => mongoDB().collection<User>(`users`)
