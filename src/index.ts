import express, {
    Request,
    Response
} from "express"

import 'dotenv/config'

import { Users }  from "./db/users"

const app = express()

app.get(`/`, async (req: Request, res: Response) => {
    const users = await Users.find().toArray()
    res.send(users)
})

app.listen(80)

