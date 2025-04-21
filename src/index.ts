import express from "express"

import router from "./router"

import { getCollection } from "./db"

import Token from "./db/models/token"

import { TOKEN } from "./config"

async function init(): Promise<void> {
    const tokens = getCollection<Token>(`tokens`)
    const indexes = await tokens.indexes()
    console.log(indexes)
    const index = indexes
        .find(o => o.name == TOKEN.INACTIVE_PURGE.NAME)
    if (!index) {
        console.log(`adding index`)
        await tokens.createIndex(
            {
                _created: 1
            },
            {
                expireAfterSeconds: TOKEN.INACTIVE_PURGE.TTL,
                name: TOKEN.INACTIVE_PURGE.NAME
            }
        )
  }
}

function listen(): void {
  const app = express()

  app.use(express.json(), router)
  
  app.listen(80)
}

init().then(listen)

