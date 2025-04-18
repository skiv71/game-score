export const MONGO = {
    DB_USER: process.env.DB_USER || `mongo`,
    DB_PASS: process.env.DB_PASS || `mongo`,
    DB_HOST: process.env.DB_HOST || `localhost`,
    DB_PORT: process.env.DB_PORT || 27017,
    DB_NAME: process.env.DB_NAME || `default` 
} as const
