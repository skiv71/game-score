import express, {
    Request,
    Response
} from "express"

import { getUsers } from "./db"

import { createHash } from "crypto"

import Email, { Contact, MessageData } from "./mail"

const app = express()

app.get(`/`, async (req: Request, res: Response) => {
    const hash = createHash(`sha256`)
    
    const email = `skivy71@gmail.com`
    const b = hash.update(email)
    const hex = b.digest(`hex`)

    const sender: Contact = { name: `admin`, email: `admin@codingclub.co.uk` }
    const recipient: Contact = { name: `Neil Duffy`, email }
    const data: MessageData = { text: `Here's you key: ${hex}` }
    const mail = new Email(sender, recipient, `Hello`, data)
    const r = await mail.send()
    console.log(r)
//    const users = await getUsers().find().toArray()
    res.send(hex)
})

app.listen(80)
