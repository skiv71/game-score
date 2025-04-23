import { tokenIndexes } from "./models/token"

export default {
    async init(): Promise<void> {
        console.log(await tokenIndexes())
    }
}
