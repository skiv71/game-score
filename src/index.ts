import express, {
    Request,
    Response
} from "express"

const app = express()

app.get(`/`, (req: Request, res: Response) => {
    console.log(req.headers)
    res.send(`Welcome!`)
})

app.listen(80)

