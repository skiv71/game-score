import express, {
    Request,
    Response
} from "express"

import { getUsers } from "./db"

const app = express()

app.get(`/`, async (req: Request, res: Response) => {
    //const users = await getUsers().find().toArray()
    res.send(`yo`)
})

app.listen(80)
