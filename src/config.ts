export default {
    ADMIN: {
        NAME: `admin`,
        EMAIL: `admin@codingtutor.co.uk`,
        HOST: `https://puffin.codingtutor.co.uk/`
    },
    APP: {
        PORT: process.env.APP_PORT || 80
    },
    MAIL: {
        HOST: process.env.MAIL_HOST || `https://api.mailjet.com/v3.1/send`,
        API_KEY: process.env.MAIL_API_KEY || ``,
        SECRET: process.env.MAIL_SECRET || ``
    },
    MONGO: {
        DB_USER: process.env.DB_USER || `mongo`,
        DB_PASS: process.env.DB_PASS || `mongo`,
        DB_HOST: process.env.DB_HOST || `localhost`,
        DB_PORT: process.env.DB_PORT || 27017,
        DB_NAME: process.env.DB_NAME || `default`,
        DB_INIT: process.env.DB_INIT || 0
    },
    SCORES: {
        LIMIT: process.env.SCORES_LIMIT || 10
    }
} as const
