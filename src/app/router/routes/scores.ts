import type {
    NextFunction,
    Request,
    Response
} from "express"

import Score from "@documents/score"

import Token from "@documents/token"

import {
    CustomError,
    ErrorType
} from "../error"

import { SCORES } from "@/config"

export async function getScores(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        res.send(
            await Score.collection().find().toArray()
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
            token: tokenData = ``,
            score: value = 0,
            name = ``
        } = req.body
        if (typeof tokenData !=  `string` || tokenData.length != Token.data().length)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid token string!`)
        const token = await Token.collection().findOne({ data: tokenData })
        if (!token)
            throw new CustomError(ErrorType.NotFound, `Invalid token string!`)
        const { gameId, userId } = token
        if (!token.active)
            throw new CustomError(ErrorType.Conflict, `Token is not activated!`)
        if (typeof parseInt(value) != `number` || !value)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid score value!`)
        if (!name)
            throw new CustomError(ErrorType.InvalidRequest, `Invalid name value!`)
        const score = new Score({ name, gameId, value, userId })
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
