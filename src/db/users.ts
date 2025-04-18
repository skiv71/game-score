import {
    mongoDB,
    Model
} from "."

export interface User extends Model {
    email: string
    token: string
}

export const Users = mongoDB().collection<User>(`users`)
