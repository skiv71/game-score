import express from 'express'

import router from './router'

import { APP } from "../config"

export default {
    start(): void {
        express()
            .use(express.json(), router)
            .listen(APP.PORT, () => {
                console.log(`app ready, port: ${APP.PORT}`)
            })
    }
}
