import express from 'express'

import {
    createGame,
    getGames
} from './routes/games'

import {
    deleteScores,
    getScores,
    submitScore
} from './routes/scores'

import {
    activateToken,
    createToken,
    deleteToken,
    getTokens,
    updateToken
} from './routes/tokens'

import { getUsers } from './routes/users'

const router = express.Router()

router
    .get(`/games`, getGames)
    .post(`/games`, createGame)

    .get(`/scores`, getScores)
    .post(`/scores`, submitScore)
    .delete(`/scores/:id?`, deleteScores)

    .get(`/tokens`, getTokens)
    .get(`/tokens/:id`, activateToken)
    .put(`/tokens/:id`, updateToken)
    .post(`/tokens`, createToken)
    .delete(`/tokens/:id`, deleteToken)

    .get(`/users`, getUsers)

export default router
