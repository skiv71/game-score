import {
    MongoClient,
    Db
} from "mongodb"

import { User } from "./models"

const {
    DB_URL = `localhost`,
    DB_PORT = 27017,
    DB_USER = `mongo`,
    DB_PASS = `mongo`,
    DB_NAME = `default`
} = process.env

const mongoURL = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}:${DB_PORT}/${DB_NAME}`

console.log({mongoURL})

const mongoDB = (db: string = DB_NAME): Db => new MongoClient(mongoURL).db(db)

const users = () => mongoDB().collection<User>(`users`)

export default {
    users
}