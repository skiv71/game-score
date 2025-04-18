export const MONGO = {
    DB_USER: process.env.DB_USER || `mongo`,
    DB_PASS: process.env.DB_PASS || `mongo`,
    DB_HOST: process.env.DB_HOST || `localhost`,
    DB_PORT: process.env.DB_PORT || 27017,
    DB_NAME: process.env.DB_NAME || `default` 
} as const

export const MAIL = {
    HOST: process.env.MAIL_HOST || `https://api.mailjet.com/v3.1/send`,
    PUBLIC_KEY: process.env.MAIL_PUBLIC_KEY || ``,
    PRIVATE_KEY: process.env.MAIL_PRIVATE_KEY || ``
}
