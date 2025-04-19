import express from 'express'

import { getGames } from './games'

const router = express.Router()

router.get(`/games`, getGames)

export default router
