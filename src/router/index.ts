import express from 'express'

import {
    createGame,
    getGames
} from './games'

import {
    activateToken,
    createToken,
    deleteToken,
    getTokens,
    updateToken
} from './tokens'

import { getUsers } from './users'

const router = express.Router()

router
    .get(`/games`, getGames)
    .post(`/games`, createGame)

    .get(`/tokens`, getTokens)
    .get(`/tokens/:id`, activateToken)
    .put(`/tokens/:id`, updateToken)
    .post(`/tokens`, createToken)
    .delete(`/tokens/:id`, deleteToken)

    .get(`/users`, getUsers)

export default router
