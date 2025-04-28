import type {
    NextFunction,
    Request,
    Response
} from "express"

import Game from "@documents/game"

import Token from "@documents/token"

import User from "@documents/user"

import Mail from "@mail"

import validator from 'validator'

import { ADMIN } from "@config"

import {
    CustomError,
    ErrorType
} from "../error"

import Document from "../../../db/document"

import { validRequestBody } from "../lib"

async function createUser(
    email: string
): Promise<User> {
    const user = new User({ email })
    User.collection().insertOne(user)
    return user
}

async function tokenActivatedEmail(
    game: Game,
    user: User,
    token: Token
): Promise<string> {
    const mail = new Mail(
        Mail.contact(ADMIN.NAME, ADMIN.EMAIL),
        Mail.contact(user.email, user.email),
        `${game.name} game token`
    )
    const html = [
        `<p>Thank you for activating your ${game.name} game token.</p>`,
        `<p>You can now use this token within your game code to save high scores.</p>`,
        `<p>Token: ${token.data}</p>`
    ].join(``)
    mail.html = html
    await mail.send()
    return `Please check your email for your ${game.name} game token`
}

async function tokenCreatedEmail(
    game: Game,
    user: User,
    token: Token
): Promise<string> {
    const mail = new Mail(
        Mail.contact(ADMIN.NAME, ADMIN.EMAIL),
        Mail.contact(user.email, user.email),
        `${game.name} game token activation`
    )
    const link = new URL(`/tokens/${token._id}/`, ADMIN.HOST)
    const html = [
        `<p>Thank you for requesting your ${game.name} game token.</p>`,
        `<p>Please click the <a href=${link.href}>link</a> to activate it.</p>`,
        `<p>Note: This token will expire in 30 minutes.</p>`
    ].join(``)
    mail.html = html
    await mail.send()
    return `Please check your email for further instructions`
}

export async function activateToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const tokens = Token.collection()
        const _id = Document.id(req.params.id)
        if (!_id)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid tokenId!`)
        const token = await tokens.findOne({ _id })
        if (!token)
            throw new CustomError(ErrorType.NotFound, `Unknown tokenId!`)
        if (token.active)
            throw new CustomError(ErrorType.Conflict, `Token already active!`)
        const game = await Game.collection().findOne({ _id: token.gameId })
        if (!game)
            throw new CustomError(ErrorType.NotFound, `No game with gameId: ${token.gameId}!`)
        const user = await User.collection().findOne({ _id: token.userId })
        if (!user)
            throw new CustomError(ErrorType.NotFound, `No user with userId: ${token.userId}!`)
        const { gameId, userId } = token
        const active = true
        await tokens.deleteMany({ active, gameId, userId })
        const update = Document.update<Token>({ active })
        await tokens.updateOne({ _id: token._id }, { $set: update })
        res.send(
            await tokenActivatedEmail(game, user, token)
        )
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
        validRequestBody(req)
        const tokens = Token.collection()
        const { email, gameURL } = req.body
        if (!validator.isEmail(email))
            throw new CustomError(ErrorType.InvalidRequest, `Invali email address!`)
        const user =  await User.collection().findOne({ email })
            || await createUser(email)
        const { _id: userId } = user
        const gameId = Document.id(req.body.gameId)
        if (!gameId)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid gameId!`)
        const game = await Game.collection().findOne({ _id: gameId })
        if (!game)
            throw new CustomError(ErrorType.NotFound, `Unknown gameId!`)
        const active = false
        if (await tokens.findOne({ gameId, userId, active }))
            throw new CustomError(ErrorType.Conflict, `Pending token found, please check your email!`)
        const token = new Token({ active, gameId, gameURL, userId })
        await tokens.insertOne(token)
        res.send(
            await tokenCreatedEmail(game, user, token)
        )
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
        const _id = Document.id(req.params.id)
        if (!_id)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid token id!`)
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
        const tokenId = Document.id(req.params.id)
        if (!tokenId)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid token id!`)
        const token = await tokens.findOne({ _id: tokenId })
        if (!token)
            throw new CustomError(ErrorType.NotFound, `Unknown token id!`)
        if (!token.active)
            throw new CustomError(ErrorType.Forbidden, `Token is not activated!`)
        const gameURL = req.body.gameURL || ``
        const update = Document.update<Token>({ gameURL })
        res.send(
            await tokens.updateOne({ _id: tokenId }, { $set: update })
        )
    } catch(e) {
        next(e)
    }
    
}
