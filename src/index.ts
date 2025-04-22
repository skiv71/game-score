import express from "express"

import router from "./router"

import { mongoIndexes } from "./db"

async function init(): Promise<void> {
    console.log(await mongoIndexes())
    main()
}

function main(): void {
    const app = express()
    app.use(express.json(), router)
    app.listen(80)
}

init().then(main)
