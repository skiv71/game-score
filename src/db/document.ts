import type { CreateIndexesOptions } from 'mongodb'

import { ObjectId } from 'mongodb'

namespace Document {

    type Object<T> = Partial<{
        [K in keyof T]: T[K]
    }>

    type IndexKeyValue = -1 | 0 | 1

    type IndexKeys<T> = Partial<Record<keyof T, IndexKeyValue>>

    type IndexOptions<T> = CreateIndexesOptions & {
        partialFilterExpression?: Object<T>
    }

    export type Update<T> = Partial<Omit<T, keyof Metadata>>

    export type UpdateData<T> = Update<T> & Pick<Metadata, `_updated`>

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

        public static id(
            id?: string
        ): ObjectId | null {
            return id
                ? ObjectId.isValid(id) ? new ObjectId(id) : null
                : new ObjectId()
        }

    }

    export type Index<T> = {
        keys: IndexKeys<T>,
        options: IndexOptions<T>
    }

    export function update<T>(
        update: Update<T>
    ): UpdateData<T> {
        return {
            ...update,
            _updated: new Date()
        }
    }

}

export default Document
