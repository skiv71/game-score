import express, {
    Request,
    Response
} from "express"

import { getUsers } from "./db"

import { createHash } from "crypto"

const app = express()

app.get(`/`, async (req: Request, res: Response) => {
    const hash = createHash(`sha256`)
    const b = hash.update(`skivy71@gmail.com`)
    const hex = b.digest(`hex`)
//    const users = await getUsers().find().toArray()
    res.send(hex)
})

app.listen(80)
