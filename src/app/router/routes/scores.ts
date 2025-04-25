import type {
    NextFunction,
    Request,
    Response
} from "express"

import Score from "@documents/score"

import Token from "@documents/token"

import Document from "@/db/document"

import {
    CustomError,
    ErrorType
} from "../error"

import { SCORES } from "@/config"

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
        res.send(
            await Score.collection().find({ gameId, userId }).toArray()
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
        const {
            score: value,
            name = ``
        } = req.body
        const token = await getToken(req)
        const { gameId, userId } = token
        if (!token.active)
            throw new CustomError(ErrorType.Conflict, `Token is not activated!`)
        if (typeof parseInt(value) != `number` || !value)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid score value!`)
        if (!name)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid name value!`)
        const score = new Score({ name, gameId, value: +value, userId })
        const scores = Score.collection()
        const currentScores = Array.from(
            await scores.find({ gameId, userId }).toArray()
        ).sort((a, b) => b.value - a.value)
        if (currentScores.length > +SCORES.LIMIT) {
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

export async function deleteScores(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { gameId, userId } = await getToken(req)
        let result
        if (req.params.id) {
            const _id = Document.id(req.params.id)
            if (!_id)
                throw new CustomError(ErrorType.InvalidRequest, `Invalid token id!`)
            result = await Score.collection().deleteOne({ _id })
        } else {
            result = await Score.collection().deleteMany({ gameId, userId })
        }
        res.send(result)
    } catch(e) {
        next(e)
    }
}
