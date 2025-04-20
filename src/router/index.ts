import express from 'express'

import {
    createGame,
    getGames
} from './games'

import {
    activateToken,
    createToken,
    deleteToken,
    getTokens
} from './tokens'

import { getUsers } from './users'

const router = express.Router()

router
    .get(`/games`, getGames)
    .post(`/games`, createGame)

router
    .get(`/tokens`, getTokens)
    .get(`/tokens/activate`, activateToken)
    .post(`/tokens`, createToken)
    .delete(`/tokens/:id`, deleteToken)

router
    .get(`/users`, getUsers)

export default router
