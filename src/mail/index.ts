import { MAIL } from "@config"

export type Contact = {
    name: string,
    email: string
}

export type MessageData = {
    text?: string,
    html?: string
}

type Message = {
    from: Contact,
    to: Contact[],
    subject: string,
    textPart: string,
    htmlPart: string
}

export default class Mail {

    public text = ``
    public html = ``

    constructor(
        readonly sender: Contact,
        readonly recipient: Contact,
        readonly subject: string
    ) {}

    private message(): Message {
        return {
            from: this.sender,
            to: [this.recipient],
            subject: this.subject || `No Subject`,
            textPart: this.text || ``,
            htmlPart: this.html || `` 
        }
    }

    private requestBody(): string {
        return JSON.stringify({ messages: [this.message()] })
    }

    private requestAuth(): string {
        const base64 = Buffer.from([MAIL.API_KEY, MAIL.SECRET].join(`:`))
            .toString(`base64`)
        return `Basic ${base64}`
    }
    
    private requestHeaders(): HeadersInit {
        const headers = new Headers()
        headers.set(`content-type`, `application/json`)
        headers.set(`authorization`, this.requestAuth())
        return headers
    }

    public static contact(
        name: string,
        email: string
    ): Contact {
        return {
            name,
            email
        }
    }

    public send(): Promise<Response> {
        const options: RequestInit = {
            method: `POST`,
            headers: this.requestHeaders(),
            body: this.requestBody()
        }
        return fetch(MAIL.HOST, options)
    }
}
