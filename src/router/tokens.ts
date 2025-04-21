import {
    Request,
    Response
} from "express"

import {
    documentId,
    getCollection
} from "../db"

import Game from "../db/models/game"

import Token from "../db/models/token"

import User from "../db/models/user"

import Mail from "../mail"

import validator from 'validator'

import {
    ADMIN,
    MESSAGE
} from "../config"

import { users } from "./users"

import { games } from "./games"

export const tokens = getCollection<Token>(`tokens`)

async function createUser(
    email: string
): Promise<User> {
    const user = new User({ email })
    await users.insertOne(user)
    return user
}

const getUser = (email: string): Promise<User | null> => users.findOne({ email })

async function activateTokenEmail(
    game: Game,
    user: User,
    token: Token
): Promise<void> {
    const mail = new Mail(
        Mail.contact(ADMIN.NAME, ADMIN.EMAIL),
        Mail.contact(user.email, user.email),
        `${game.name} token`
    )
    const html = [
        `<p>Thank you for activating your ${game.name} token.</p>`,
        `<p>You can now use this token within your game code to save high scores.</p>`,
        `<p>Token: ${token.data}</p>`
    ].join(``)
    mail.html = html
    await mail.send()
}

async function createTokenEmail(
    game: Game,
    user: User,
    token: Token
): Promise<void> {
    const mail = new Mail(
        Mail.contact(ADMIN.NAME, ADMIN.EMAIL),
        Mail.contact(user.email, user.email),
        `${game.name} token activation`
    )
    const link = new URL(`/tokens/${token._id}/`, ADMIN.HOST)
    const html = [
        `<p>Thank you for requesting your ${game.name} token.</p>`,
        `<p>Please click the <a href=${link.href}>link</a> to activate it.</p>`,
        `<p>Note: This token will expire in 15 minutes.</p>`
    ].join(``)
    mail.html = html
    await mail.send()
}

export async function activateToken(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const tokenId = documentId(req.params.id)
        if (!tokenId) {
            res.status(400).send(`Invalid tokenId!`)
            return
        }
        const token = await tokens.findOne({ _id: tokenId })
        if (!token) {
            res.status(400).send(`Invalid tokenId`)
            return
        }
        if (token.active) {
            res.status(403).send(`Token already active!`)
            return
        }
        const game = await games.findOne({ _id: token.gameId })
        if (!game)
            throw new Error(`Failed to find game with id: ${token.gameId}!`)
        const user = await users.findOne({ _id: token.userId })
        if (!user)
            throw new Error(`Failed to find user with id: ${token.userId}!`)
        token.active = true
        await tokens.updateOne({ _id: tokenId }, { $set: new Token(token) })
        await activateTokenEmail(game, user, token)
        res.send(`OK`)
    } catch(e) {
        console.error(e)
        res.status(500).send(MESSAGE.SERVER_ERROR)
    }
}

export async function createToken(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { email, gameURL } = req.body
        if (!validator.isEmail(email)) {
            res.status(400).send(`Invalid email address!`)
            return
        }
        const user = await getUser(email) || await createUser(email)
        const { _id: userId } = user
        const gameId = documentId(req.body.gameId)
        if (!gameId) {
            res.status(400).send(`Invalid gameId!`)
            return
        }
        const game = await games.findOne({ _id: gameId })
        if (!game) {
            res.status(400).send(`Invalid gameId!`)
            return
        }
        if (await tokens.findOne({ gameId, userId, active: false })) {
            res.status(409).send(`Pending token awating activation!`)
            return
        }
        await tokens.deleteMany({ gameId, userId })
        const token = new Token({ gameId, gameURL, userId })
        await tokens.insertOne(token)
        await createTokenEmail(game, user, token)
        res.send(token)
    } catch(e) {
        console.error(e)
        res.status(500).send(MESSAGE.SERVER_ERROR)
    }
}

export async function getTokens(
    req: Request,
    res: Response
): Promise<void> {
    try {
        res.send(await tokens.find().toArray())
    } catch(e) {
        console.error(e)
        res.status(500).send(MESSAGE.SERVER_ERROR)
    }
}

export async function deleteToken(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const _id = documentId(req.params.id)
        if (!_id) {
            res.status(400).send(`Invalid token id!`)
            return
        }
        res.send(await tokens.deleteOne({ _id }))
    } catch(e) {
        console.error(e)
        res.status(500).send(MESSAGE.SERVER_ERROR)
    }
}
