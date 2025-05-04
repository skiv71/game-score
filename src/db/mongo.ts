import {
    Db,
    MongoClient,
    type MongoClientOptions
} from "mongodb"

import { MONGO } from "@config"

const url = `mongodb://${MONGO.DB_HOST}:${MONGO.DB_PORT}`

const options: MongoClientOptions = {
    auth: {
        username: MONGO.DB_USER,
        password: MONGO.DB_PASS
    }
}

const clients = new Set<MongoClient>()

namespace Mongo {

    function createClient(): MongoClient {
        console.log(`creating mongo client`)
        const client = new MongoClient(url, options)
        client.on(`error`, () => {
            clients.delete(client)
        })
        clients.add(client)
        return client
    }

    export function db(
        db: string = MONGO.DB_NAME
    ): Db  {
        const [client] = clients.values()
        return (client || createClient()).db(db)
    }

}

export default Mongo
