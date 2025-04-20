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

import Mail from "../mail"

import validator from 'validator'

import {
    ADMIN,
    MESSAGE
} from "../config"

const games = getCollection<Game>(`games`)
const tokens = getCollection<Token>(`tokens`)
const users = getCollection<User>(`users`)

async function createUser(
    email: string
): Promise<User> {
    const user = new User(email)
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
        `<p>Thank you for activating your game token.</p>`,
        `<p>You can now use this token within your game to track high scores.</p>`,
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
        `<p>Thank you for requesting your game token.</p>`,
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
        console.log(`params`, req.params.id)
        const tokenId = documentId(req.params.id)
        console.log({ tokenId })
        if (!tokenId) {
            res.status(400).send(`Invalid tokenId!`)
            return
        }
        const token = await tokens.findOne({ _id: tokenId })
        console.log({ token })
        if (!token) {
            res.status(400).send(`Invalid tokenId`)
            return
        }
        if (token.active) {
            res.status(403).send(`Token already active!`)
            return
        }
        const game = await games.findOne({ _id: token.gameId })
        console.log({ game })
        const user = await users.findOne({ _id: token.userId })
        console.log({ user })
        if (!game || !user) {
            res.status(500).send(MESSAGE.SERVER_ERROR)
            return
        }
        await tokens.updateOne({ _id: tokenId }, { $set: { active: true }})
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
        const { email } = req.body
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
        if (await tokens.findOne({ active: false, gameId, userId })) {
            res.status(403).send(`Token already created!`)
            return
        }
        const token = new Token(gameId, userId)
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
