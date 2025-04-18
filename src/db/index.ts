import {
    MongoClient,
    Db,
    Collection
} from "mongodb"

import { User } from "./models"

const {
    DB_HOST = `localhost`,
    DB_PORT = 27017,
    DB_USER = `mongo`,
    DB_PASS = `mongo`,
    DB_NAME = `default`
} = process.env

const url = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

console.log({ url })

const mongoDB = (db: string = DB_NAME): Db => new MongoClient(url).db(db)

export const getUsers = (): Collection<User> => mongoDB().collection<User>(`users`)
