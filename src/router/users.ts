import { getCollection } from "../db"

import { User } from "../db/models"

import { getDocuments } from "./shared"

export const getUsers = getDocuments(
    getCollection<User>(`users`)
)
