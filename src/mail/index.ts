import { MAIL } from "../config"

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
    to: Contact,
    subject: string,
    textPart: string,
    htmlPart: string
}

export default class Mail {

    constructor(
        public sender: Contact,
        public recipient: Contact,
        public subject: string,
        public data: MessageData
    ) {}

    private message(): Message {
        return {
            from: this.sender,
            to: this.recipient,
            subject: this.subject,
            textPart: this.data.text || ``,
            htmlPart: this.data.html || `` 
        }
    }

    private requestBody(): string {
        return JSON.stringify({ messages: [this.message()] })
    }

    private requestAuth(): string {
        const base64 = Buffer.from([MAIL.PUBLIC_KEY, MAIL.PRIVATE_KEY].join(`:`))
            .toString(`base64`)
        return [`Basic`, base64]
            .join(` `)
    }
    
    private requestHeaders(): HeadersInit {
        const headers = new Headers()
        headers.set(`content-type`, `application/json`)
        headers.set(`authorization`, this.requestAuth())
        return headers
    }
    
    public send(): Promise<Response> {
        return fetch(MAIL.HOST, {
            method: `POST`,
            headers: this.requestHeaders(),
            body: this.requestBody()
        })
    }
}
