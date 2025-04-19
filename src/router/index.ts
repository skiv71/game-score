import express from 'express'

import {
    createGame,
    getGames
} from './games'

import {
    activateToken,
    createToken,
    getTokens
} from './tokens'

const router = express.Router()

router
    .get(`/games`, getGames)
    .post(`/games`, createGame)

router
    .get(`/tokens`, getTokens)
    .get(`/tokens/activate`, activateToken)
    .post(`/tokens`, createToken)

export default router
