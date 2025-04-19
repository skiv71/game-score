import {
    MongoClient,
    MongoClientOptions,
    Db,
    Collection
} from "mongodb"

import { Game, User } from "./models"

import { MONGO } from "../config"

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

const mongoDB = (): Db => new MongoClient(client.url, client.options).db(MONGO.DB_NAME)

const users = (): Collection<User> => mongoDB().collection<User>(`users`)

const games = (): Collection<Game> => mongoDB().collection<Game>(`games`)

export default {
    games,
    users
}
