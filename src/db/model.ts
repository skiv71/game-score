import {
    CreateIndexesOptions,
    ObjectId
} from "mongodb"

namespace Model {

    export interface Schema {
        _id: ObjectId
        _created: Date
        _updated: Date
    }

    export class Document<T extends Partial<Schema>> implements Schema {

        readonly _id: ObjectId
        readonly _created: Date
        readonly _updated: Date

        constructor(
            o: T
        ) {
            const d = new Date()
            this._id = o._id || new ObjectId()
            this._created = o._created || d
            this._updated = o._updated || d
        }

        public update(
            o: Update<T>
        ): Update<T> & Pick<Schema, `_updated`> {
            return { ...o, _updated: new Date() }
        }

    }

    type Object<T> = Partial<{
        [K in keyof T]: T[K]
    }>

    type IndexKeyValue = -1 | 0 | 1

    type IndexKeys<T> = Partial<Record<keyof T, IndexKeyValue>>

    type IndexOptions<T> = CreateIndexesOptions & {
        partialFilterExpression?: Object<T>
    }

    export type Index<T> = {
        keys: IndexKeys<T>,
        options: IndexOptions<T>
    }

    export type Update<T> = Partial<Omit<T, keyof Schema>>

}

export default Model
