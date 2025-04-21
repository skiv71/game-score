import express from "express"

import router from "./router"

import { getCollection } from "./db"

import Token from "./db/models/token"

async function init(): Promise<void> {
  const indexes = await getCollection<Token>(`tokens`).indexes()
  console.log(indexes)
  
}

function listen(): void {
  const app = express()

  app.use(express.json(), router)
  
  app.listen(80)
}

init().then(listen)

