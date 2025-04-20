import {
    Request,
    Response
} from "express"

import { getCollection } from "../db"

import { User } from "../db/models"

import { MESSAGE } from "../config"

const users = getCollection<User>(`users`)

export async function getUsers(
    req: Request,
    res: Response
): Promise<void> {
    try {
        res.send(await users.find().toArray())
    } catch(e) {
        console.error(e)
        res.status(500).send(MESSAGE.SERVER_ERROR)
    }
}
