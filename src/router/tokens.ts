import {
    NextFunction,
    Request,
    Response
} from "express"

import { documentId } from "../db/utils"

import Game from "../db/models/game"

import Token from "../db/models/token"

import User from "../db/models/user"

import Mail from "../mail"

import validator from 'validator'

import {
    ADMIN,
} from "../config"

import {
    ConflictError,
    ForbiddenError,
    InvalidError,
    NotFoundError
} from "./error"

async function createUser(
    email: string
): Promise<User.Document> {
    const user = new User.Document({ email })
    await User.collection().insertOne(user)
    return user
}

async function tokenActivatedEmail(
    game: Game.Document,
    user: User.Document,
    token: Token.Document
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

async function tokenCreatedEmail(
    game: Game.Document,
    user: User.Document,
    token: Token.Document
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
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokens = Token.collection()
        const tokenId = documentId(req.params.id)
        if (!tokenId)
            throw new InvalidError(`Invalid tokenId!`)
        const token = await tokens.findOne({ _id: tokenId })
        if (!token)
            throw new NotFoundError(`Unknown tokenId!`)
        if (token.active)
            throw new ConflictError(`Token already acivated!`)
        const game = await Game.collection().findOne({ _id: token.gameId })
        if (!game)
            throw new NotFoundError(`No game with gameId: ${token.gameId}!`)
        const user = await User.collection().findOne({ _id: token.userId })
        if (!user)
            throw new NotFoundError(`No user with userId: ${token.userId}!`)
        const update = new Token.Document(token).update({ active: true })
        await tokens.updateOne({ _id: tokenId }, { $set: update })
        await tokenActivatedEmail(game, user, token)
        res.send(`OK`)
    } catch(e) {
        console.error(e)
        next(e)
    }
}

export async function createToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokens = Token.collection()
        const { email, gameURL } = req.body
        if (!validator.isEmail(email))
            throw new InvalidError(`Invalid email address!`)
        const user =  await User.collection().findOne({ email })
            || await createUser(email)
        const { _id: userId } = user
        const gameId = documentId(req.body.gameId)
        if (!gameId)
            throw new InvalidError(`Invalid gameId!`)
        const game = await Game.collection().findOne({ _id: gameId })
        if (!game)
            throw new NotFoundError(`Unknown gameId!`)
        if (await tokens.findOne({ gameId, userId, active: false }))
            throw new ConflictError(`Pending token awaiting activation!`)
        await tokens.deleteMany({ gameId, userId })
        const token = new Token.Document({ gameId, gameURL, userId })
        await tokens.insertOne(token)
        await tokenCreatedEmail(game, user, token)
        res.send(token)
    } catch(e) {
        next(e)
    }
}

export async function getTokens(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        res.send(
            await Token.collection().find().toArray()
        )
    } catch(e) {
        next(e)
    }
}

export async function deleteToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const _id = documentId(req.params.id)
        if (!_id)
            throw new InvalidError(`Invalid token id!`)
        res.send(
            await Token.collection().deleteOne({ _id })
        )
    } catch(e) {
        next(e)
    }
}

export async function updateToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokens = Token.collection()
        const tokenId = documentId(req.params.id)
        if (!tokenId)
            throw new InvalidError(`Invalid token id!`)
        const token = await tokens.findOne({ _id: tokenId })
        if (!token)
            throw new NotFoundError(`Unknown token id!`)
        if (!token.active)
            throw new ForbiddenError(`Inactive token!`)
        const gameURL = req.body.gameURL || ``
        res.send(
            await tokens.updateOne({ _id: tokenId }, { $set: token.update({ gameURL }) })
        )
    } catch(e) {
        next(e)
    }
    
}
