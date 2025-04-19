import express from 'express'

import {
    createGame,
    getGames
} from './games'

import {
    createToken,
    getTokens
} from './tokens'

const router = express.Router()

router
    .get(`/games`, getGames)
    .post(`/games`, createGame)

router
    .get(`/tokens`, getTokens)
    .post(`/tokens/create`, createToken)

export default router
