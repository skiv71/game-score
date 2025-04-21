export const MONGO = {
    DB_USER: process.env.DB_USER || `mongo`,
    DB_PASS: process.env.DB_PASS || `mongo`,
    DB_HOST: process.env.DB_HOST || `localhost`,
    DB_PORT: process.env.DB_PORT || 27017,
    DB_NAME: process.env.DB_NAME || `default` 
} as const

export const MAIL = {
    HOST: process.env.MAIL_HOST || `https://api.mailjet.com/v3.1/send`,
    API_KEY: process.env.MAIL_API_KEY || ``,
    SECRET: process.env.MAIL_SECRET || ``
}

export const ADMIN = {
    NAME: `admin`,
    EMAIL: `skivy71@gmail.com`,
    HOST: `https://default-game-score.1guv9s.easypanel.host/`
}

export const MESSAGE = {
    SERVER_ERROR: `A server error has occurred!`
}

export const TOKEN = {
    INACTIVE_PURGE: {
        NAME: `inactive-token-purge`,
        TTL: 900
    }
}
