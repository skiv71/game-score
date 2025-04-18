import express, {
    Request,
    Response
} from "express"

import db from "./db"

const app = express()

app.get(`/`, async (req: Request, res: Response) => {
    const users = await db.users.find().toArray()
    res.send(users)
})

app.listen(80)
