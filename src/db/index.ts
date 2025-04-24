import { tokenIndexes } from "./models/token"

import { MONGO } from "../config"

export default {
    async init(): Promise<void> {
        if (MONGO.DB_INIT) {
            console.log(`db.init()`)
            console.log(await tokenIndexes())
        }
    }
}
