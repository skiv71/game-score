import express from "express"

import router from "./router"

import { mongoIndexes } from "./db"

import { APP } from "./config"

async function init(): Promise<void> {
    console.log(await mongoIndexes())
    main()
}

function main(): void {
    console.log(`start`)
    const app = express()
    app.use(express.json(), router)
    app.listen(APP.PORT)
}

init().then(main)
