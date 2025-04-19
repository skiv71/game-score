import {
    Request,
    Response
} from "express"

import {
    documentId,
    getCollection
} from "../db"

import {
    Game,
    Token,
    User
} from "../db/models"

import validator from 'validator'

async function createUser(
    email: string
): Promise<User> {
    const user = new User(email)
    await getCollection<User>(`users`)
        .insertOne(user)
    return user
}

async function getUser(
    email: string
): Promise<User | undefined> {
    const [user] = await getCollection<User>(`users`)
        .find({ email })
        .toArray()
    return user
}

export async function createToken(
    req: Request,
    res: Response
): Promise<void> {
    const { email } = req.body
    if (!validator.isEmail(email)) {
        res.status(400).send(`Invalid email address!`)
        return
    }
    const user = await getUser(email) || await createUser(email)
    const gameId = documentId(req.body.gameId)
    if (!gameId) {
        res.status(400).send(`Invalid gameId!`)
        return
    }
    const [game] = await getCollection<Game>(`games`)
        .find({ gameId })
        .toArray()
    if (!game) {
        res.status(400).send(`Invalid gameId!`)
        return
    }
    const token = new Token(gameId, user._id)
    await getCollection<Token>(`tokens`)
        .insertOne(token)
    res.send(token)
}

export async function getTokens(
    req: Request,
    res: Response
): Promise<void> {
    const tokens = await getCollection<Token>(`tokens`)
        .find()
        .toArray()
    res.send(tokens)
}
