import express from 'express'

import cors from 'cors'

import router from './router'

import { errorHandler } from './router/error'

import { APP } from "../config"

export default {
    start(): void {
        express()
            .use(cors())
            .use(express.json())
            .use(router)
            .use(errorHandler)
            .listen(APP.PORT, () => {
                console.log(`app ready, port: ${APP.PORT}`)
            })
    }
}
