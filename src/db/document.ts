import {
    type CreateIndexesOptions,
    ObjectId
} from "mongodb"

namespace Document {

    type Object<T> = Partial<{
        [K in keyof T]: T[K]
    }>

    type IndexKeyValue = -1 | 0 | 1

    type IndexKeys<T> = Partial<Record<keyof T, IndexKeyValue>>

    type IndexOptions<T> = CreateIndexesOptions & {
        partialFilterExpression?: Object<T>
    }

    export type Metadata = {
        readonly _id: ObjectId
        readonly _created: Date
        readonly _updated: Date
    }

    export class Class<T> implements Metadata {

        readonly _id: ObjectId
        readonly _created: Date
        readonly _updated: Date

        constructor(
            o: Partial<T & Metadata>
        ) {
            this._id = o._id || new ObjectId()
            this._created = o._created || new Date()
            this._updated = o._updated || new Date()
        }

    }

    export type Index<T> = {
        keys: IndexKeys<T>,
        options: IndexOptions<T>
    }

    type Update<T> = Partial<Omit<T, keyof Metadata>>

    export function update<T>(
        update: Update<T>
    ) {
        return { ...update, _updated: new Date() }
    }

    export function id(
        id?: string
    ): ObjectId | null {
        return id
            ? ObjectId.isValid(id) ? new ObjectId(id) : null
            : new ObjectId()
    }

}

export default Document
