import express, {
    // Request,
    // Response
} from "express"

import router from "./router"

// import { getUsers } from "./db"

// import { createHash } from "crypto"

// import Mail, { MessageData } from "./mail"

// import { generateToken } from "./token"

const app = express()

app.use(express.json(), router)

//app.get(`/`, async (req: Request, res: Response) => {
  //  res.send(generateToken())
//     const hash = createHash(`sha256`)
    
//     const email = `skivy71@gmail.com`
//     const b = hash.update(email)
//     const hex = b.digest(`hex`)

//     const sender = Mail.contact(`admin`, email)
//     const recipient = Mail.contact(`Neil Duffy`, email)
//     const data =  Mail.messageData(`Here's you key: ${hex}`)
//     const mail = new Mail(sender, recipient, `Hello`, data)
//     const r = await mail.send()
//     console.log(r)
// //    const users = await getUsers().find().toArray()
//     res.send(hex)
//})

app.listen(80)
