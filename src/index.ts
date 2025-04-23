import app from "./app"

import db from "./db"

db.init()
    .then(() => app.start())
