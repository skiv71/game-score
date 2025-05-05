import type {
    NextFunction,
    Request,
    Response
} from "express"

import {
    CustomError,
    ErrorType
} from "../error"

import {
    getResult,
    validRequestBody
} from "../lib"

import { Filter } from "bad-words"

import {
    Score,
    Token
} from "@/db/documents"

import config from "@/config"

async function getToken(
    req: Request
): Promise<Token> {
    const { token: tokenData } = req.headers
    if (typeof tokenData !=  `string` || tokenData.length != Token.data().length)
        throw new CustomError(ErrorType.Unauthorized)
    const token = await Token.collection().findOne({ data: tokenData })
    if (!token)
        throw new CustomError(ErrorType.Unauthorized)
    return token
}

export async function getScores(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { gameId, userId } = await getToken(req)
        const scores = await Score.collection().find({ gameId, userId }).toArray() 
        res.send(
            getResult<Score>(scores)
        )
    } catch(e) {
        next(e)
    }
}

export async function submitScore(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        validRequestBody(req)
        const {
            value,
            level,
            name: _name = ``
        } = req.body
        const token = await getToken(req)
        const { gameId, userId } = token
        if (!token.active)
            throw new CustomError(ErrorType.Conflict, `Token is not activated!`)
        if (typeof parseInt(value) != `number` || !value)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid score value!`)
        if (!_name)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid name value!`)
        const name = new Filter().clean(_name).trim()
        const score = new Score({ name, gameId, value, userId, level })
        const scores = Score.collection()
        const currentScores = Array.from(
            await scores.find({ gameId, userId }).toArray()
        ).sort((a, b) => a.value - b.value)
        if (currentScores.length >= +config.SCORES.LIMIT) {
            const [lowest] = currentScores
            if (score.value < lowest.value)
                throw new CustomError(ErrorType.Conflict, `Score limit reached, score is below current lowest!`)
            await scores.deleteOne({ _id: lowest._id })
        } 
        res.send(
            await scores.insertOne(score)
        )
    } catch(e) {
        next(e)
    }
}

export async function deleteScore(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        await getToken(req)
        const _id = Score.id(req.params.id)
        if (!_id)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid token id!`)
        res.send(
            await Score.collection().deleteOne({ _id })
        )
    } catch(e) {
        next(e)
    }
}

export async function deleteScores(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { gameId, userId } = await getToken(req)
        res.send(
            await Score.collection().deleteMany({ gameId, userId })
        )
    } catch(e) {
        next(e)
    }
}
