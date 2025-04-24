export const MONGO = {
    DB_USER: process.env.DB_USER || `mongo`,
    DB_PASS: process.env.DB_PASS || `mongo`,
    DB_HOST: process.env.DB_HOST || `localhost`,
    DB_PORT: process.env.DB_PORT || 27017,
    DB_NAME: process.env.DB_NAME || `default`,
    DB_INIT: process.env.DB_INIT || 0
} as const

export const MAIL = {
    HOST: process.env.MAIL_HOST || `https://api.mailjet.com/v3.1/send`,
    API_KEY: process.env.MAIL_API_KEY || ``,
    SECRET: process.env.MAIL_SECRET || ``
} as const

export const ADMIN = {
    NAME: `admin`,
    EMAIL: `skivy71@gmail.com`,
    HOST: `https://default-game-score.1guv9s.easypanel.host/`
} as const

export const APP = {
    PORT: process.env.APP_PORT || 80
} as const
