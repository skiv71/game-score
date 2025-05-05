import express from 'express'

import cors from 'cors'

import router from './router'

import { errorHandler } from './router/error'

import config from '@/config'

export default {
    start(): void {
        const port = config.APP.PORT
        express()
            .use(cors())
            .use(express.json())
            .use(router)
            .use(errorHandler)
            .listen(port, () => {
                console.log(`app ready, port: ${port}`)
            })
    }
}
